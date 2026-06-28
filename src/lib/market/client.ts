import type {
  DealerQuote,
  NewVehicleLookupResult,
  TradeInLookupInput,
  TradeInLookupResult,
  MarketExecutiveSummary,
} from "@/engine/market/types";
import { buildMarketExecutiveSummary } from "@/engine/market";
import { calculateMonthlyPayment } from "@/engine/finance";

export async function fetchNewVehicleMarket(
  query: string,
  askingPrice?: number
): Promise<NewVehicleLookupResult> {
  const params = new URLSearchParams({ q: query });
  if (askingPrice) params.set("asking", String(askingPrice));
  const res = await fetch(`/api/market/new-vehicle?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Market lookup failed");
  }
  return res.json();
}

export async function fetchTradeInMarket(input: TradeInLookupInput): Promise<TradeInLookupResult> {
  const res = await fetch("/api/market/trade-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Trade-in valuation failed");
  }
  return res.json();
}

export function computeExecutiveSummary(
  newVehicle: NewVehicleLookupResult | null,
  tradeIn: TradeInLookupResult | null,
  vehiclePrice: number,
  cashDeposit: number,
  interestRate: number,
  termMonths: number
): MarketExecutiveSummary | null {
  const totalDeposit = (tradeIn?.tradeInValue ?? 0) + cashDeposit;
  const financeRequired = Math.max(0, vehiclePrice - totalDeposit);
  const monthlyInstalment = calculateMonthlyPayment(financeRequired, interestRate, termMonths);

  return buildMarketExecutiveSummary(
    newVehicle,
    tradeIn,
    financeRequired,
    monthlyInstalment,
    vehiclePrice
  );
}

export type { DealerQuote };
