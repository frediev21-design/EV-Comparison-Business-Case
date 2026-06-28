import type { BusinessCaseType, BusinessCaseInput, BusinessCaseResult } from "./types";
import { runFullBusinessCase } from "./index";

export interface CalculatorPlugin {
  type: BusinessCaseType;
  calculate: (input: BusinessCaseInput) => BusinessCaseResult;
}

export const calculators: Record<BusinessCaseType, CalculatorPlugin> = {
  "fleet-ev": {
    type: "fleet-ev",
    calculate: runFullBusinessCase,
  },
};

export function calculateBusinessCase(input: BusinessCaseInput): BusinessCaseResult {
  const plugin = calculators[input.type];
  if (!plugin) throw new Error(`Unknown business case type: ${input.type}`);
  return plugin.calculate(input);
}
