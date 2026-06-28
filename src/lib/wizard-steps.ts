import type { WizardStep } from "@/store/case-store";
import { WIZARD_STEPS } from "@/store/case-store";

export type WorkflowMode = "quick" | "full";

export const DATA_ENTRY_STEP_IDS: WizardStep[] = WIZARD_STEPS.filter(
  (s) => s.step >= 1 && s.step <= 7
).map((s) => s.id);

export const QUICK_DATA_ENTRY_IDS: WizardStep[] = ["vehicles", "trade-in"];

export const QUICK_WORKFLOW_STEPS: WizardStep[] = [
  "vehicles",
  "trade-in",
  "dashboard",
  "what-if",
  "scenarios",
  "reports",
];

export const FULL_WORKFLOW_STEPS: WizardStep[] = WIZARD_STEPS.map((s) => s.id);

export function getWorkflowSteps(mode: WorkflowMode): WizardStep[] {
  return mode === "quick" ? QUICK_WORKFLOW_STEPS : FULL_WORKFLOW_STEPS;
}

export function getDataEntrySteps(mode: WorkflowMode): WizardStep[] {
  return mode === "quick" ? QUICK_DATA_ENTRY_IDS : DATA_ENTRY_STEP_IDS;
}

export function isStepInWorkflow(step: WizardStep, mode: WorkflowMode): boolean {
  return getWorkflowSteps(mode).includes(step);
}

export function getNextStep(current: WizardStep, mode: WorkflowMode): WizardStep | null {
  const steps = getWorkflowSteps(mode);
  const idx = steps.indexOf(current);
  if (idx === -1 || idx >= steps.length - 1) return null;
  return steps[idx + 1];
}

export function getPrevStep(current: WizardStep, mode: WorkflowMode): WizardStep | null {
  const steps = getWorkflowSteps(mode);
  const idx = steps.indexOf(current);
  if (idx <= 0) return null;
  return steps[idx - 1];
}

export function getStepLabel(step: WizardStep): string {
  return WIZARD_STEPS.find((s) => s.id === step)?.label ?? step;
}

export function hasWhatIfOverrides(whatIf: object | undefined): boolean {
  return !!whatIf && Object.keys(whatIf).length > 0;
}
