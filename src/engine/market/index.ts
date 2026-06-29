import type {
  MarketBuyRating,
  MarketDemand,
  NewVehicleLookupResult,
  TradeInLookupInput,
  TradeInLookupResult,
} from "./types";
import { CONDITION_MULTIPLIERS, MARKET_RATING_LABELS } from "./types";
import {
  findNewVehicle,
  findUsedVehicle,
  searchNewVehicles,
  listNewVehicleLabels,
  MARKET_DATA_AS_OF,
  type CuratedNewVehicle,
  type CuratedUsedVehicle,
} from "./curated-data";

function nowIso(): string {
  return new Date().toISOString();
}

function aggregateSources(sources: { id: string; name: string; price: number }[]) {
  const prices = sources.map((s) => s.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  return { min, max, avg, sourceCount: sources.length };
}

function calcConfidence(sourceCount: number, spread: number, avg: number): number {
  const spreadPenalty = avg > 0 ? (spread / avg) * 100 : 0;
  return Math.round(Math.min(98, Math.max(55, 60 + sourceCount * 5 - spreadPenalty * 0.5)));
}

function calcDemand(listings: number, daysOnMarket: number, reductions: number): {
  demand: MarketDemand;
  reason: string;
} {
  if (listings > 80 && daysOnMarket < 20) {
    return { demand: "high", reason: `${listings} listings, avg ${daysOnMarket} days on market` };
  }
  if (listings > 30 && daysOnMarket < 35) {
    return { demand: "medium", reason: `${listings} listings, ${reductions} recent price reductions` };
  }
  return { demand: "low", reason: `Limited listings (${listings}), slower market (${daysOnMarket} days avg)` };
}

function marketRating(asking: number, average: number): MarketBuyRating {
  const ratio = asking / average;
  if (ratio <= 0.97) return "excellent_buy";
  if (ratio <= 1.0) return "good_buy";
  if (ratio <= 1.04) return "average_buy";
  return "overpriced";
}

function buildNegotiationAdvice(average: number, asking: number, target: number): string {
  const diff = asking - average;
  if (diff <= 0) {
    return `The asking price of R${asking.toLocaleString()} is at or below the average South African retail price of R${average.toLocaleString()}. This represents strong value. Suggested negotiation target: R${target.toLocaleString()}.`;
  }
  return `The average South African retail price is R${average.toLocaleString()}. The dealer is asking R${asking.toLocaleString()}. This is approximately R${diff.toLocaleString()} above market. Suggested negotiation target: R${target.toLocaleString()}.`;
}

function mileageFactor(mileage: number, baseMileage: number): number {
  const diff = mileage - baseMileage;
  return Math.max(0.75, 1 - (diff / 100000) * 0.15);
}

function yearFactor(year: number, baseYear: number): number {
  const diff = baseYear - year;
  return Math.max(0.7, 1 - diff * 0.06);
}

function buildPriceHistory(baseValue: number, months = 12): { month: string; value: number }[] {
  const result: { month: string; value: number }[] = [];
  const d = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(d.getFullYear(), d.getMonth() - i, 1);
    const month = date.toLocaleDateString("en-ZA", { month: "short", year: "2-digit" });
    const depreciation = 1 - (months - 1 - i) * 0.008;
    result.push({ month, value: Math.round(baseValue * depreciation) });
  }
  return result;
}

function buildFutureResale(
  currentValue: number,
  depreciationRate: number,
  horizons = [3, 5, 7, 10]
) {
  return horizons.map((years) => {
    const factor = Math.pow(1 - depreciationRate, years);
    const value = Math.round(currentValue * factor);
    const depreciation = currentValue - value;
    const residualPercent = Math.round(factor * 100);
    return { years, value, depreciation, residualPercent };
  });
}

export function lookupNewVehicle(
  query: string,
  askingPrice?: number
): NewVehicleLookupResult | null {
  const matches = searchNewVehicles(query, 1);
  const vehicle = matches[0] ?? findNewVehicle(query);
  if (!vehicle) return null;
  return buildNewVehicleResult(vehicle, askingPrice);
}

function buildNewVehicleResult(
  vehicle: CuratedNewVehicle,
  askingPrice?: number
): NewVehicleLookupResult {
  const { min, max, avg, sourceCount } = aggregateSources(vehicle.sources);
  const spread = max - min;
  const confidenceScore = calcConfidence(sourceCount, spread, avg);
  const asking = askingPrice ?? max;
  const recommendedPurchasePrice = Math.round(avg * 0.99);
  const negotiationTarget = Math.round(avg * 0.98);
  const rating = marketRating(asking, avg);

  return {
    query: `${vehicle.manufacturer} ${vehicle.model}`,
    manufacturer: vehicle.manufacturer,
    model: vehicle.model,
    variant: vehicle.variant,
    retailPrice: vehicle.retailPrice,
    averageDealerPrice: avg,
    lowestDealerPrice: min,
    highestDealerPrice: max,
    recommendedPurchasePrice,
    promotions: vehicle.promotions,
    financeOffers: vehicle.financeOffers,
    deliveryCharges: vehicle.deliveryCharges,
    dealerAvailability: vehicle.dealerAvailability,
    confidenceScore,
    sourceCount,
    sources: vehicle.sources.map((s) => ({ ...s, lastSeen: nowIso() })),
    priceLastUpdated: nowIso(),
    askingPrice: asking,
    marketRating: rating,
    negotiationTarget,
    negotiationAdvice: buildNegotiationAdvice(avg, asking, negotiationTarget),
  };
}

export function lookupTradeIn(input: TradeInLookupInput): TradeInLookupResult | null {
  const vehicle = findUsedVehicle(input.manufacturer, input.model);
  if (!vehicle) return buildGenericTradeIn(input);
  return buildTradeInResult(vehicle, input);
}

function buildGenericTradeIn(input: TradeInLookupInput): TradeInLookupResult {
  const estimatedNew = 600000;
  const age = new Date().getFullYear() - input.year;
  const base = estimatedNew * Math.pow(0.88, age) * mileageFactor(input.mileage, 80000);
  const condition = CONDITION_MULTIPLIERS[input.condition];
  const tradeIn = Math.round(base * 0.78 * condition);
  const privateSale = Math.round(tradeIn * 1.13);
  const dealerRetail = Math.round(privateSale * 1.11);

  return buildTradeInOutput(
    input,
    tradeIn,
    privateSale,
    dealerRetail,
    tradeIn * 0.92,
    [{ id: "estimate", name: "Market Estimate", price: privateSale }],
    45,
    "medium",
    "Estimated from depreciation model",
    "Limited market data — curated sources recommended for higher accuracy.",
    0.12
  );
}

function buildTradeInResult(
  vehicle: CuratedUsedVehicle,
  input: TradeInLookupInput
): TradeInLookupResult {
  const yearF = yearFactor(input.year, vehicle.baseYear);
  const mileF = mileageFactor(input.mileage, vehicle.baseMileage);
  const condition = CONDITION_MULTIPLIERS[input.condition];
  const serviceBonus = input.serviceHistory ? 1.03 : 0.97;
  const accidentPenalty = input.accidentHistory ? 0.88 : 1.0;

  const multiplier = yearF * mileF * condition * serviceBonus * accidentPenalty;

  const tradeIn = Math.round(vehicle.tradeInBase * multiplier);
  const privateSale = Math.round(vehicle.privateSaleBase * multiplier);
  const dealerRetail = Math.round(vehicle.dealerRetailBase * multiplier);
  const auction = Math.round(vehicle.auctionBase * multiplier);

  const { demand, reason } = calcDemand(
    vehicle.listingsCount,
    vehicle.avgDaysOnMarket,
    vehicle.priceReductions
  );

  const depositDiff = privateSale - tradeIn;
  const advice = `Estimated trade-in: R${tradeIn.toLocaleString()}. Private sale: R${privateSale.toLocaleString()}. Dealer retail: R${dealerRetail.toLocaleString()}. ${
    depositDiff > 10000
      ? `Trading the vehicle in is convenient but selling privately could increase your available deposit by approximately R${depositDiff.toLocaleString()}.`
      : "Trade-in value is competitive with private sale after considering convenience and time."
  }`;

  return buildTradeInOutput(
    input,
    tradeIn,
    privateSale,
    dealerRetail,
    auction,
    vehicle.sources,
    calcConfidence(vehicle.sources.length, dealerRetail - auction, privateSale),
    demand,
    reason,
    advice,
    vehicle.depreciationRateAnnual
  );
}

function buildTradeInOutput(
  input: TradeInLookupInput,
  tradeIn: number,
  privateSale: number,
  dealerRetail: number,
  auction: number,
  sources: { id: string; name: string; price: number }[],
  confidenceScore: number,
  demand: MarketDemand,
  demandReason: string,
  tradeInAdvice: string,
  depreciationRate: number
): TradeInLookupResult {
  const prices = [tradeIn, privateSale, dealerRetail, auction];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const average = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  return {
    tradeInValue: tradeIn,
    dealerRetail,
    privateSale,
    auctionValue: auction,
    recommendedSellingPrice: privateSale,
    minimum: min,
    average,
    maximum: max,
    confidenceScore,
    sourceCount: sources.length,
    sources: sources.map((s) => ({ ...s, lastSeen: nowIso() })),
    priceLastUpdated: nowIso(),
    demand,
    demandReason: demandReason,
    tradeInAdvice,
    priceHistory: buildPriceHistory(privateSale),
    futureResale: buildFutureResale(dealerRetail, depreciationRate),
  };
}

export function buildMarketExecutiveSummary(
  newVehicle: NewVehicleLookupResult | null,
  tradeIn: TradeInLookupResult | null,
  amountFinanced: number,
  monthlyInstalment: number,
  askingPrice?: number
) {
  if (!newVehicle && !tradeIn) return null;

  const purchase = newVehicle?.recommendedPurchasePrice ?? 0;
  const trade = tradeIn?.tradeInValue ?? 0;
  const privateSale = tradeIn?.privateSale ?? 0;
  const asking = askingPrice ?? newVehicle?.askingPrice ?? purchase;
  const negotiationOpportunity = Math.max(0, asking - purchase);

  const rating = newVehicle?.marketRating ?? "average_buy";

  return {
    recommendedPurchasePrice: purchase,
    recommendedTradeValue: trade,
    recommendedPrivateSaleValue: privateSale,
    financeRequired: amountFinanced,
    monthlyInstalment,
    negotiationOpportunity,
    overallMarketRating: rating,
    overallMarketRatingLabel: MARKET_RATING_LABELS[rating],
    priceLastUpdated: newVehicle?.priceLastUpdated ?? tradeIn?.priceLastUpdated ?? nowIso(),
    sourceCount: (newVehicle?.sourceCount ?? 0) + (tradeIn?.sourceCount ?? 0),
    confidenceLevel: Math.round(
      ((newVehicle?.confidenceScore ?? 0) + (tradeIn?.confidenceScore ?? 0)) /
        (newVehicle && tradeIn ? 2 : 1)
    ),
  };
}

export { MARKET_RATING_LABELS, searchNewVehicles, listNewVehicleLabels, MARKET_DATA_AS_OF };
