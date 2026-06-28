export type VehicleCondition = "excellent" | "good" | "average" | "below_average" | "poor";
export type MarketDemand = "high" | "medium" | "low";
export type MarketBuyRating = "excellent_buy" | "good_buy" | "average_buy" | "overpriced";

export interface MarketSource {
  id: string;
  name: string;
  price: number;
  url?: string;
  lastSeen: string;
}

export interface NewVehicleLookupResult {
  query: string;
  manufacturer: string;
  model: string;
  variant: string;
  retailPrice: number;
  averageDealerPrice: number;
  lowestDealerPrice: number;
  highestDealerPrice: number;
  recommendedPurchasePrice: number;
  promotions: string[];
  financeOffers: string[];
  deliveryCharges: number;
  dealerAvailability: string;
  confidenceScore: number;
  sourceCount: number;
  sources: MarketSource[];
  priceLastUpdated: string;
  askingPrice?: number;
  marketRating: MarketBuyRating;
  negotiationTarget: number;
  negotiationAdvice: string;
}

export interface TradeInLookupInput {
  manufacturer: string;
  model: string;
  variant?: string;
  year: number;
  mileage: number;
  condition: VehicleCondition;
  colour?: string;
  serviceHistory: boolean;
  accidentHistory: boolean;
  province?: string;
}

export interface TradeInLookupResult {
  tradeInValue: number;
  dealerRetail: number;
  privateSale: number;
  auctionValue: number;
  recommendedSellingPrice: number;
  minimum: number;
  average: number;
  maximum: number;
  confidenceScore: number;
  sourceCount: number;
  sources: MarketSource[];
  priceLastUpdated: string;
  demand: MarketDemand;
  demandReason: string;
  tradeInAdvice: string;
  priceHistory: { month: string; value: number }[];
  futureResale: { years: number; value: number; depreciation: number; residualPercent: number }[];
}

export interface DealerQuote {
  id: string;
  dealerName: string;
  vehiclePrice: number;
  accessories: number;
  financeOffer: string;
  tradeInOffer: number;
  delivery: number;
  notes?: string;
}

export interface MarketExecutiveSummary {
  recommendedPurchasePrice: number;
  recommendedTradeValue: number;
  recommendedPrivateSaleValue: number;
  financeRequired: number;
  monthlyInstalment: number;
  negotiationOpportunity: number;
  overallMarketRating: MarketBuyRating;
  overallMarketRatingLabel: string;
  priceLastUpdated: string;
  sourceCount: number;
  confidenceLevel: number;
}

export interface MarketIntelligenceResult {
  newVehicle: NewVehicleLookupResult | null;
  tradeIn: TradeInLookupResult | null;
  executiveSummary: MarketExecutiveSummary | null;
  dealerQuotes: DealerQuote[];
}

export const CONDITION_MULTIPLIERS: Record<VehicleCondition, number> = {
  excellent: 1.08,
  good: 1.0,
  average: 0.92,
  below_average: 0.85,
  poor: 0.75,
};

export const MARKET_RATING_LABELS: Record<MarketBuyRating, string> = {
  excellent_buy: "Excellent Buy",
  good_buy: "Good Buy",
  average_buy: "Average Buy",
  overpriced: "Overpriced",
};

export const SA_PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
];
