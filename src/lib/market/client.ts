import type {
  DealerQuote,
  NewVehicleLookupResult,
  TradeInLookupInput,
  TradeInLookupResult,
  MarketExecutiveSummary,
} from "@/engine/market/types";
import { buildMarketExecutiveSummary } from "@/engine/market";
import { calculateMonthlyPayment } from "@/engine/finance";
import type { MarketCacheMeta } from "@/lib/market/cache";

export type MarketApiResponse<T> = {
  result: T;
  meta: MarketCacheMeta;
};

async function parseMarketResponse<T>(res: Response): Promise<{ data: T; meta?: MarketCacheMeta }> {
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error ?? "Market request failed");
  }
  if (body.result !== undefined) {
    return { data: body.result as T, meta: body.meta as MarketCacheMeta | undefined };
  }
  return { data: body as T };
}

export async function fetchNewVehicleMarket(
  query: string,
  askingPrice?: number
): Promise<MarketApiResponse<NewVehicleLookupResult>> {
  const params = new URLSearchParams({ q: query });
  if (askingPrice) params.set("asking", String(askingPrice));
  const res = await fetch(`/api/market/new-vehicle?${params}`);
  const { data, meta } = await parseMarketResponse<NewVehicleLookupResult>(res);
  return { result: data, meta: meta ?? { fetchedAt: new Date().toISOString(), cacheHit: false, expiresAt: new Date().toISOString() } };
}

export async function fetchTradeInMarket(input: TradeInLookupInput): Promise<MarketApiResponse<TradeInLookupResult>> {
  const res = await fetch("/api/market/trade-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const { data, meta } = await parseMarketResponse<TradeInLookupResult>(res);
  return { result: data, meta: meta ?? { fetchedAt: new Date().toISOString(), cacheHit: false, expiresAt: new Date().toISOString() } };
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
