import { create } from "zustand";
import type {
  DealerQuote,
  NewVehicleLookupResult,
  TradeInLookupInput,
  TradeInLookupResult,
  MarketExecutiveSummary,
} from "@/engine/market/types";
import { findNewVehicle } from "@/engine/market/curated-data";
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
  newVehicleError: string | null;
  tradeInInput: TradeInLookupInput;
  tradeInResult: TradeInLookupResult | null;
  tradeInError: string | null;
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
  syncTradeInFromCase: () => void;
  addDealerQuote: (quote: Omit<DealerQuote, "id">) => void;
  updateDealerQuote: (id: string, partial: Partial<DealerQuote>) => void;
  removeDealerQuote: (id: string) => void;
  initFromCase: () => void;
}

const defaultTradeInInput: TradeInLookupInput = {
  manufacturer: "",
  model: "",
  year: new Date().getFullYear() - 3,
  mileage: 60000,
  condition: "good",
  colour: "",
  serviceHistory: true,
  accidentHistory: false,
  province: "Gauteng",
};

function tradeInInputFromCase(): TradeInLookupInput {
  const current = useCaseStore.getState().input.current;
  return {
    manufacturer: current.manufacturer,
    model: current.model,
    year: current.year > 0 ? current.year : new Date().getFullYear() - 3,
    mileage: current.mileage > 0 ? current.mileage : 60000,
    condition: "good",
    serviceHistory: true,
    accidentHistory: false,
    province: "Gauteng",
  };
}

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

function newVehicleQueryFromCase(): string {
  const input = useCaseStore.getState().input;
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
  if (selected?.name?.trim()) return selected.name.trim();
  if (selected?.manufacturer?.trim()) return selected.manufacturer.trim();
  return "";
}

export const useMarketStore = create<MarketStore>((set, get) => ({
  newVehicleQuery: "",
  newVehicleResult: null,
  newVehicleError: null,
  tradeInInput: defaultTradeInInput,
  tradeInResult: null,
  tradeInError: null,
  executiveSummary: null,
  dealerQuotes: [],
  loading: false,
  error: null,
  lastRefresh: null,

  setNewVehicleQuery: (q) => set({ newVehicleQuery: q, newVehicleError: null }),

  setTradeInField: (key, value) =>
    set((s) => ({ tradeInInput: { ...s.tradeInInput, [key]: value }, tradeInError: null })),

  searchNewVehicle: async (askingPrice) => {
    const query = get().newVehicleQuery.trim();
    if (!query) {
      set({ newVehicleError: "Enter a vehicle name to search." });
      return;
    }

    set({ loading: true, error: null, newVehicleError: null });
    try {
      const { result } = await fetchNewVehicleMarket(query, askingPrice);
      const tradeInResult = get().tradeInResult;
      set({
        newVehicleResult: result,
        newVehicleError: null,
        loading: false,
        lastRefresh: new Date().toISOString(),
        executiveSummary: recomputeSummary(result, tradeInResult),
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Lookup failed";
      set({
        loading: false,
        newVehicleResult: null,
        newVehicleError: message,
        error: message,
      });
    }
  },

  searchTradeIn: async () => {
    const input = get().tradeInInput;
    if (!input.manufacturer.trim() || !input.model.trim()) {
      set({ tradeInError: "Enter manufacturer and model for your current vehicle." });
      return;
    }

    set({ loading: true, error: null, tradeInError: null });
    try {
      const { result } = await fetchTradeInMarket(input);
      const newVehicleResult = get().newVehicleResult;
      set({
        tradeInResult: result,
        tradeInError: null,
        loading: false,
        lastRefresh: new Date().toISOString(),
        executiveSummary: recomputeSummary(newVehicleResult, result),
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Valuation failed";
      set({
        loading: false,
        tradeInResult: null,
        tradeInError: message,
        error: message,
      });
    }
  },

  refreshAll: async () => {
    const state = get();
    set({ loading: true, error: null, newVehicleError: null, tradeInError: null });

    const tasks: Promise<void>[] = [];

    if (state.newVehicleQuery.trim()) {
      tasks.push(
        fetchNewVehicleMarket(state.newVehicleQuery, state.newVehicleResult?.askingPrice)
          .then(({ result }) => {
            set({ newVehicleResult: result, newVehicleError: null });
          })
          .catch((e) => {
            const message = e instanceof Error ? e.message : "New vehicle lookup failed";
            set({ newVehicleResult: null, newVehicleError: message });
          })
      );
    }

    if (state.tradeInInput.manufacturer.trim() && state.tradeInInput.model.trim()) {
      tasks.push(
        fetchTradeInMarket(state.tradeInInput)
          .then(({ result }) => {
            set({ tradeInResult: result, tradeInError: null });
          })
          .catch((e) => {
            const message = e instanceof Error ? e.message : "Trade-in valuation failed";
            set({ tradeInResult: null, tradeInError: message });
          })
      );
    }

    if (tasks.length === 0) {
      set({ loading: false });
      return;
    }

    await Promise.all(tasks);

    const latest = get();
    set({
      loading: false,
      lastRefresh: new Date().toISOString(),
      executiveSummary: recomputeSummary(latest.newVehicleResult, latest.tradeInResult),
      error: latest.newVehicleError ?? latest.tradeInError,
    });
  },

  applyNewVehiclePrice: () => {
    const result = get().newVehicleResult;
    if (!result) return;
    const caseState = useCaseStore.getState();
    const selectedId = caseState.input.selectedReplacementId;
    if (!selectedId) {
      set({ error: "Add a replacement vehicle on the New Vehicle step before applying prices." });
      return;
    }
    useCaseStore.getState().updateReplacement(selectedId, {
      price: result.recommendedPurchasePrice,
      name: `${result.manufacturer} ${result.model}`,
      manufacturer: result.manufacturer,
    });
    set({ executiveSummary: recomputeSummary(result, get().tradeInResult), error: null });
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

  syncTradeInFromCase: () => {
    set({ tradeInInput: tradeInInputFromCase(), tradeInError: null });
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
    const query = newVehicleQueryFromCase();
    const tradeInInput = tradeInInputFromCase();
    set({
      newVehicleQuery: query,
      tradeInInput,
      newVehicleResult: null,
      tradeInResult: null,
      newVehicleError: null,
      tradeInError: null,
      executiveSummary: null,
      error: null,
    });
  },
}));

export function canAutoSearchMarket(): boolean {
  const query = newVehicleQueryFromCase();
  return Boolean(query && findNewVehicle(query));
}
