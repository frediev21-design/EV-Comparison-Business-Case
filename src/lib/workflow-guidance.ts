import type { BusinessCaseInput } from "@/engine/types";
import type { WizardStep } from "@/store/case-store";
import { getDataEntrySteps, getStepLabel, type WorkflowMode } from "@/lib/wizard-steps";
import { getDataEntryProgress, isStepComplete } from "@/lib/wizard-validation";

/** First incomplete data-entry step, or null when setup is complete. */
export function getNextIncompleteStep(
  mode: WorkflowMode,
  input: BusinessCaseInput
): WizardStep | null {
  for (const step of getDataEntrySteps(mode)) {
    if (!isStepComplete(step, input)) return step;
  }
  return null;
}

export function isSetupComplete(mode: WorkflowMode, input: BusinessCaseInput): boolean {
  return getNextIncompleteStep(mode, input) === null;
}

export function getSetupProgress(mode: WorkflowMode, input: BusinessCaseInput) {
  return getDataEntryProgress(input, mode);
}

/** Full coach banner only for the first couple of setup steps. */
export function shouldShowFullSetupBanner(completed: number): boolean {
  return completed < 2;
}

export function nextStepPromptLabel(step: WizardStep): string {
  return getStepLabel(step);
}
