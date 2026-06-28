import { calculateMonthlyPayment } from "@/engine/finance";
import type { BusinessCaseInput, BusinessCaseResult } from "@/engine/types";
import type { WizardStep } from "@/store/case-store";
import { getDataEntrySteps, type WorkflowMode } from "./wizard-steps";

export type ValidationSeverity = "warning" | "error";

export interface ValidationMessage {
  id: string;
  severity: ValidationSeverity;
  message: string;
  step?: WizardStep;
}

function instalmentLooksLikeTotalCost(
  monthlyInstalment: number,
  outstandingFinance: number
): boolean {
  if (outstandingFinance <= 0) return false;
  const ceiling = calculateMonthlyPayment(outstandingFinance, 14, 42) * 2;
  return monthlyInstalment > ceiling;
}

export function getCaseValidationMessages(
  input: BusinessCaseInput,
  result: BusinessCaseResult
): ValidationMessage[] {
  const messages: ValidationMessage[] = [];
  const { current } = input;

  if (instalmentLooksLikeTotalCost(current.monthlyInstalment, current.outstandingFinance)) {
    messages.push({
      id: "instalment-total-cost",
      severity: "warning",
      message:
        "Monthly loan instalment looks like total vehicle cost (fuel + maintenance included). Enter finance payment only — running costs are calculated separately.",
      step: "vehicles",
    });
  }

  if (current.outstandingFinance > current.currentValue * 0.9) {
    messages.push({
      id: "negative-equity",
      severity: "warning",
      message:
        "Outstanding finance is close to trade value — very little equity for the replacement deposit.",
      step: "trade-in",
    });
  }

  if (result.tradeIn.tradeEquity < 50000 && current.currentValue > 0) {
    messages.push({
      id: "low-equity",
      severity: "warning",
      message: `Trade equity is only ${result.tradeIn.tradeEquity.toLocaleString("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 })} — replacement finance will be high.`,
      step: "trade-in",
    });
  }

  if (!current.manufacturer.trim() || !current.model.trim()) {
    messages.push({
      id: "missing-vehicle",
      severity: "error",
      message: "Enter manufacturer and model for the current vehicle.",
      step: "vehicles",
    });
  }

  if (input.replacements.length === 0) {
    messages.push({
      id: "no-replacement",
      severity: "error",
      message: "Add at least one replacement vehicle.",
      step: "vehicles",
    });
  }

  return messages;
}

function isCurrentVehicleComplete(input: BusinessCaseInput): boolean {
  const { current } = input;
  return (
    !!current.manufacturer.trim() &&
    !!current.model.trim() &&
    current.year > 1990 &&
    current.currentValue > 0 &&
    current.monthlyInstalment >= 0 &&
    current.fuelConsumption > 0 &&
    input.assumptions.dailyDistanceKm > 0
  );
}

function isReplacementComplete(input: BusinessCaseInput): boolean {
  return (
    input.replacements.length > 0 &&
    input.replacements.some((v) => v.price > 0 && !!v.name.trim())
  );
}

export function isStepComplete(step: WizardStep, input: BusinessCaseInput): boolean {
  const { current } = input;

  switch (step) {
    case "vehicles":
      return isCurrentVehicleComplete(input) && isReplacementComplete(input);
    case "trade-in":
      return current.currentValue > 0 && current.outstandingFinance >= 0;
    case "finance":
      return input.replacements.every((v) => v.interestRate > 0 && v.financeTermMonths >= 12);
    case "running-costs":
      return input.assumptions.fuelPricePerLitre > 0 && input.assumptions.electricityTariff > 0;
    case "solar":
      return (
        input.solar.solarChargingPercent + input.solar.gridChargingPercent === 100 &&
        input.solar.systemSizeKw > 0
      );
    case "ownership":
      return current.residualValue >= 0;
    case "risk":
      return true;
    default:
      return true;
  }
}

export function getStepIncompleteHint(step: WizardStep, input: BusinessCaseInput): string {
  const { current } = input;

  switch (step) {
    case "vehicles":
      if (!current.manufacturer.trim() || !current.model.trim())
        return "Enter manufacturer and model for your current vehicle.";
      if (current.year <= 1990) return "Enter a valid vehicle year.";
      if (current.currentValue <= 0) return "Enter current vehicle value.";
      if (current.fuelConsumption <= 0) return "Enter fuel consumption (L/100km).";
      if (input.assumptions.dailyDistanceKm <= 0) return "Enter daily distance (km/day).";
      if (!isReplacementComplete(input))
        return "Add at least one replacement vehicle with a name and price.";
      return "Complete the required fields above.";
    case "trade-in":
      return "Enter current value and outstanding finance.";
    case "finance":
      return "Set interest rate and finance term for each replacement.";
    case "running-costs":
      return "Fuel and electricity prices must be greater than zero.";
    case "solar":
      return "Solar and grid charging must total 100%, with system size set.";
    case "ownership":
      return "Enter residual value for the current vehicle.";
    default:
      return "Complete the required fields above.";
  }
}

export function getDataEntryProgress(
  input: BusinessCaseInput,
  mode: WorkflowMode
): { completed: number; total: number; steps: WizardStep[] } {
  const steps = getDataEntrySteps(mode);
  const completed = steps.filter((step) => isStepComplete(step, input)).length;
  return { completed, total: steps.length, steps };
}
