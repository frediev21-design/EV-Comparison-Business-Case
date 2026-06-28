import { create } from "zustand";
import { runFullBusinessCase } from "@/engine";
import type { BusinessCaseInput, BusinessCaseResult, ReplacementVehicle, WhatIfOverrides } from "@/engine/types";
import { createDefaultBusinessCase, createId } from "./defaults";
import type { WorkflowMode } from "@/lib/wizard-steps";
import { inputForLoad } from "@/lib/snapshot-sanitize";

export type WizardStep =
  | "current"
  | "replacement"
  | "trade-in"
  | "finance"
  | "running-costs"
  | "solar"
  | "ownership"
  | "risk"
  | "dashboard"
  | "charts"
  | "what-if"
  | "scenarios"
  | "reports"
  | "decision"
  | "market";

export const WIZARD_STEPS: { id: WizardStep; label: string; step: number }[] = [
  { id: "current", label: "Current Vehicle", step: 1 },
  { id: "replacement", label: "New Vehicle", step: 2 },
  { id: "trade-in", label: "Trade-In", step: 3 },
  { id: "finance", label: "Finance", step: 4 },
  { id: "running-costs", label: "Running Costs", step: 5 },
  { id: "solar", label: "Solar Edge", step: 6 },
  { id: "ownership", label: "Ownership", step: 7 },
  { id: "risk", label: "Risk Analysis", step: 8 },
  { id: "dashboard", label: "Dashboard", step: 9 },
  { id: "decision", label: "Decision Intel", step: 0 },
  { id: "market", label: "SA Market", step: 0 },
  { id: "charts", label: "Charts", step: 10 },
  { id: "what-if", label: "What-If", step: 11 },
  { id: "scenarios", label: "Scenarios", step: 12 },
  { id: "reports", label: "Reports", step: 13 },
];

interface CaseStore {
  caseId: string | null;
  caseName: string;
  tags: string[];
  input: BusinessCaseInput;
  result: BusinessCaseResult;
  activeStep: WizardStep;
  workflowMode: WorkflowMode;
  ownershipHorizon: 5 | 7 | 10;
  presentationMode: boolean;
  lastSavedAt: string | null;
  routeCaseMissing: boolean;
  setCaseId: (id: string | null) => void;
  setCaseName: (name: string) => void;
  setTags: (tags: string[]) => void;
  setActiveStep: (step: WizardStep) => void;
  setWorkflowMode: (mode: WorkflowMode) => void;
  setOwnershipHorizon: (years: 5 | 7 | 10) => void;
  updateCurrent: (partial: Partial<BusinessCaseInput["current"]>) => void;
  updateTradeIn: (partial: Partial<BusinessCaseInput["tradeIn"]>) => void;
  updateAssumptions: (partial: Partial<BusinessCaseInput["assumptions"]>) => void;
  updateSolar: (partial: Partial<BusinessCaseInput["solar"]>) => void;
  updateWhatIf: (partial: WhatIfOverrides) => void;
  resetWhatIf: () => void;
  addReplacement: (vehicle: Omit<ReplacementVehicle, "id">) => void;
  updateReplacement: (id: string, partial: Partial<ReplacementVehicle>) => void;
  removeReplacement: (id: string) => void;
  selectReplacement: (id: string) => void;
  loadCase: (input: BusinessCaseInput, meta?: { id?: string; name?: string; tags?: string[] }) => void;
  resetCase: () => void;
  setPresentationMode: (on: boolean) => void;
  setLastSavedAt: (iso: string | null) => void;
  setRouteCaseMissing: (missing: boolean) => void;
}

function computeResult(input: BusinessCaseInput): BusinessCaseResult {
  return runFullBusinessCase(input);
}

const defaultInput = createDefaultBusinessCase();

export const useCaseStore = create<CaseStore>((set) => ({
  caseId: null,
  caseName: "Current Situation",
  tags: ["Business Use"],
  input: defaultInput,
  result: computeResult(defaultInput),
  activeStep: "current",
  workflowMode: "full",
  ownershipHorizon: 10,
  presentationMode: false,
  lastSavedAt: null,
  routeCaseMissing: false,

  setCaseId: (id) => set({ caseId: id }),
  setCaseName: (name) => set({ caseName: name }),
  setTags: (tags) => set({ tags }),
  setActiveStep: (step) => set({ activeStep: step }),
  setWorkflowMode: (mode) => set({ workflowMode: mode }),
  setOwnershipHorizon: (years) => set({ ownershipHorizon: years }),
  setPresentationMode: (on) => set({ presentationMode: on }),
  setLastSavedAt: (iso) => set({ lastSavedAt: iso }),
  setRouteCaseMissing: (missing) => set({ routeCaseMissing: missing }),

  updateCurrent: (partial) =>
    set((state) => {
      const whatIf = state.input.whatIf ? { ...state.input.whatIf } : undefined;
      if (whatIf) {
        if (partial.currentValue !== undefined) delete whatIf.tradeValue;
        if (partial.outstandingFinance !== undefined) delete whatIf.outstandingFinance;
        if (partial.maintenance !== undefined) delete whatIf.maintenance;
        if (partial.insurance !== undefined) delete whatIf.insurance;
      }
      const input = {
        ...state.input,
        current: { ...state.input.current, ...partial },
        whatIf: whatIf && Object.keys(whatIf).length > 0 ? whatIf : undefined,
      };
      return { input, result: computeResult(input) };
    }),

  updateTradeIn: (partial) =>
    set((state) => {
      const tradeIn = {
        ...state.input.tradeIn,
        additionalCashDeposit: state.input.tradeIn?.additionalCashDeposit ?? 0,
        ...partial,
      };
      const input = { ...state.input, tradeIn };
      return { input, result: computeResult(input) };
    }),

  updateAssumptions: (partial) =>
    set((state) => {
      const input = { ...state.input, assumptions: { ...state.input.assumptions, ...partial } };
      return { input, result: computeResult(input) };
    }),

  updateSolar: (partial) =>
    set((state) => {
      const input = { ...state.input, solar: { ...state.input.solar, ...partial } };
      return { input, result: computeResult(input) };
    }),

  updateWhatIf: (partial) =>
    set((state) => {
      const input = {
        ...state.input,
        whatIf: { ...state.input.whatIf, ...partial },
      };
      return { input, result: computeResult(input) };
    }),

  resetWhatIf: () =>
    set((state) => {
      const input = { ...state.input, whatIf: undefined };
      return { input, result: computeResult(input) };
    }),

  addReplacement: (vehicle) =>
    set((state) => {
      const newVehicle = { ...vehicle, id: createId() };
      const input = {
        ...state.input,
        replacements: [...state.input.replacements, newVehicle],
        selectedReplacementId: newVehicle.id,
      };
      return { input, result: computeResult(input) };
    }),

  updateReplacement: (id, partial) =>
    set((state) => {
      const input = {
        ...state.input,
        replacements: state.input.replacements.map((v) =>
          v.id === id ? { ...v, ...partial } : v
        ),
      };
      return { input, result: computeResult(input) };
    }),

  removeReplacement: (id) =>
    set((state) => {
      if (state.input.replacements.length <= 1) return state;
      const replacements = state.input.replacements.filter((v) => v.id !== id);
      const input = {
        ...state.input,
        replacements,
        selectedReplacementId:
          state.input.selectedReplacementId === id
            ? replacements[0].id
            : state.input.selectedReplacementId,
      };
      return { input, result: computeResult(input) };
    }),

  selectReplacement: (id) =>
    set((state) => {
      const input = { ...state.input, selectedReplacementId: id };
      return { input, result: computeResult(input) };
    }),

  loadCase: (input, meta) => {
    const loaded = inputForLoad(input);
    set({
      input: {
        ...loaded,
        tradeIn: {
          additionalCashDeposit: loaded.tradeIn?.additionalCashDeposit ?? 0,
        },
        assumptions: {
          ...loaded.assumptions,
          fleetVehicleCount: loaded.assumptions.fleetVehicleCount ?? 1,
        },
      },
      result: computeResult({
        ...loaded,
        assumptions: {
          ...loaded.assumptions,
          fleetVehicleCount: loaded.assumptions.fleetVehicleCount ?? 1,
        },
      }),
      caseId: meta?.id ?? null,
      caseName: meta?.name ?? "Loaded Scenario",
      tags: meta?.tags ?? [],
      lastSavedAt: null,
      routeCaseMissing: false,
    });
  },

  resetCase: () => {
    const input = createDefaultBusinessCase();
    set({
      caseId: null,
      caseName: "Current Situation",
      tags: ["Business Use"],
      input,
      result: computeResult(input),
      activeStep: "current",
      presentationMode: false,
      lastSavedAt: null,
      routeCaseMissing: false,
    });
  },
}));

export function useSelectedReplacement() {
  const input = useCaseStore((s) => s.input);
  return input.replacements.find((v) => v.id === input.selectedReplacementId);
}

export function useSelectedFinance() {
  const result = useCaseStore((s) => s.result);
  const selectedId = useCaseStore((s) => s.input.selectedReplacementId);
  return result.finance.find((f) => f.vehicleId === selectedId);
}
