import { runFullBusinessCase } from "@/engine";
import type { BusinessCaseInput, ScenarioRecord } from "@/engine/types";
import type { TrafficLightStatus } from "@/engine/decision/types";
import { getWorkflowSteps, type WorkflowMode } from "@/lib/wizard-steps";
import { isStepComplete } from "@/lib/wizard-validation";
import type { WizardStep } from "@/store/case-store";

export interface ScenarioPreview {
  vehicleComparison: string;
  monthlySaving: number;
  investmentScore: number;
  rating: string;
  trafficLight: TrafficLightStatus;
  trafficLightLabel: string;
}

export function previewScenario(snapshot: BusinessCaseInput): ScenarioPreview {
  const result = runFullBusinessCase(snapshot);
  const current = `${snapshot.current.manufacturer} ${snapshot.current.model}`.trim();
  const replacement =
    snapshot.replacements.find((v) => v.id === snapshot.selectedReplacementId)?.name ??
    "Replacement";

  return {
    vehicleComparison: current ? `${current} → ${replacement}` : replacement,
    monthlySaving: result.kpis.monthlySaving,
    investmentScore: result.decision.investmentScore.total,
    rating: result.decision.investmentScore.rating,
    trafficLight: result.decision.trafficLight.status,
    trafficLightLabel: result.decision.trafficLight.label,
  };
}

export function getResumeStep(
  snapshot: BusinessCaseInput,
  workflowMode: WorkflowMode = "full"
): WizardStep {
  const steps = getWorkflowSteps(workflowMode);
  const firstIncomplete = steps.find((step) => !isStepComplete(step, snapshot));
  return firstIncomplete ?? "dashboard";
}

export function sortScenariosByUpdated(scenarios: ScenarioRecord[]): ScenarioRecord[] {
  return [...scenarios].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
