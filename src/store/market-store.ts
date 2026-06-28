import { create } from "zustand";
import type {
  DealerQuote,
  NewVehicleLookupResult,
  TradeInLookupInput,
  TradeInLookupResult,
  MarketExecutiveSummary,
} from "@/engine/market/types";
import {
  fetchNewVehicleMarket,
  fetchTradeInMarket,
  computeExecutiveSummary,
} from "@/lib/market/client";
import { useCaseStore } from "./case-store";
import { createId } from "./defaults";

interface MarketStore {
  newVehicleQuery: string;
  newVehicleResult: NewVehicleLookupResult | null;
  tradeInInput: TradeInLookupInput;
  tradeInResult: TradeInLookupResult | null;
  executiveSummary: MarketExecutiveSummary | null;
  dealerQuotes: DealerQuote[];
  loading: boolean;
  error: string | null;
  lastRefresh: string | null;

  setNewVehicleQuery: (q: string) => void;
  setTradeInField: <K extends keyof TradeInLookupInput>(key: K, value: TradeInLookupInput[K]) => void;
  searchNewVehicle: (askingPrice?: number) => Promise<void>;
  searchTradeIn: () => Promise<void>;
  refreshAll: () => Promise<void>;
  applyNewVehiclePrice: () => void;
  applyTradeInValue: () => void;
  addDealerQuote: (quote: Omit<DealerQuote, "id">) => void;
  updateDealerQuote: (id: string, partial: Partial<DealerQuote>) => void;
  removeDealerQuote: (id: string) => void;
  initFromCase: () => void;
}

const defaultTradeInInput: TradeInLookupInput = {
  manufacturer: "Ford",
  model: "Ranger Wildtrak Bi-Turbo",
  year: 2021,
  mileage: 85000,
  condition: "good",
  colour: "White",
  serviceHistory: true,
  accidentHistory: false,
  province: "Gauteng",
};

function recomputeSummary(
  newVehicleResult: NewVehicleLookupResult | null,
  tradeInResult: TradeInLookupResult | null
): MarketExecutiveSummary | null {
  const caseState = useCaseStore.getState();
  const selected = caseState.input.replacements.find(
    (v) => v.id === caseState.input.selectedReplacementId
  );
  if (!selected && !newVehicleResult && !tradeInResult) return null;

  return computeExecutiveSummary(
    newVehicleResult,
    tradeInResult,
    newVehicleResult?.recommendedPurchasePrice ?? selected?.price ?? 0,
    caseState.input.tradeIn.additionalCashDeposit,
    selected?.interestRate ?? 10,
    selected?.financeTermMonths ?? 72
  );
}

export const useMarketStore = create<MarketStore>((set, get) => ({
  newVehicleQuery: "BYD Shark 6",
  newVehicleResult: null,
  tradeInInput: defaultTradeInInput,
  tradeInResult: null,
  executiveSummary: null,
  dealerQuotes: [],
  loading: false,
  error: null,
  lastRefresh: null,

  setNewVehicleQuery: (q) => set({ newVehicleQuery: q }),
  setTradeInField: (key, value) =>
    set((s) => ({ tradeInInput: { ...s.tradeInInput, [key]: value } })),

  searchNewVehicle: async (askingPrice) => {
    set({ loading: true, error: null });
    try {
      const result = await fetchNewVehicleMarket(get().newVehicleQuery, askingPrice);
      const tradeInResult = get().tradeInResult;
      set({
        newVehicleResult: result,
        loading: false,
        lastRefresh: new Date().toISOString(),
        executiveSummary: recomputeSummary(result, tradeInResult),
      });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : "Lookup failed" });
    }
  },

  searchTradeIn: async () => {
    set({ loading: true, error: null });
    try {
      const result = await fetchTradeInMarket(get().tradeInInput);
      const newVehicleResult = get().newVehicleResult;
      set({
        tradeInResult: result,
        loading: false,
        lastRefresh: new Date().toISOString(),
        executiveSummary: recomputeSummary(newVehicleResult, result),
      });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : "Valuation failed" });
    }
  },

  refreshAll: async () => {
    const state = get();
    set({ loading: true, error: null });
    try {
      const [newRes, tradeRes] = await Promise.all([
        fetchNewVehicleMarket(state.newVehicleQuery, state.newVehicleResult?.askingPrice),
        fetchTradeInMarket(state.tradeInInput),
      ]);
      set({
        newVehicleResult: newRes,
        tradeInResult: tradeRes,
        loading: false,
        lastRefresh: new Date().toISOString(),
        executiveSummary: recomputeSummary(newRes, tradeRes),
      });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : "Refresh failed" });
    }
  },

  applyNewVehiclePrice: () => {
    const result = get().newVehicleResult;
    if (!result) return;
    const caseState = useCaseStore.getState();
    useCaseStore.getState().updateReplacement(caseState.input.selectedReplacementId, {
      price: result.recommendedPurchasePrice,
      name: `${result.manufacturer} ${result.model}`,
      manufacturer: result.manufacturer,
    });
    set({ executiveSummary: recomputeSummary(result, get().tradeInResult) });
  },

  applyTradeInValue: () => {
    const result = get().tradeInResult;
    if (!result) return;
    useCaseStore.getState().updateCurrent({
      currentValue: result.tradeInValue,
      tradeInValue: result.tradeInValue,
      residualValue: result.futureResale.find((f) => f.years === 5)?.value ?? result.tradeInValue,
    });
    set({ executiveSummary: recomputeSummary(get().newVehicleResult, result) });
  },

  addDealerQuote: (quote) =>
    set((s) => ({
      dealerQuotes: [...s.dealerQuotes, { ...quote, id: createId() }],
    })),

  updateDealerQuote: (id, partial) =>
    set((s) => ({
      dealerQuotes: s.dealerQuotes.map((q) => (q.id === id ? { ...q, ...partial } : q)),
    })),

  removeDealerQuote: (id) =>
    set((s) => ({ dealerQuotes: s.dealerQuotes.filter((q) => q.id !== id) })),

  initFromCase: () => {
    const input = useCaseStore.getState().input;
    const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
    set({
      newVehicleQuery: selected?.name ?? "BYD Shark 6",
      tradeInInput: {
        manufacturer: input.current.manufacturer,
        model: input.current.model,
        year: input.current.year,
        mileage: input.current.mileage,
        condition: "good",
        serviceHistory: true,
        accidentHistory: false,
        province: "Gauteng",
      },
    });
  },
}));
