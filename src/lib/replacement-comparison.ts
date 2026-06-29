import { runFullBusinessCase } from "@/engine";
import type { BusinessCaseInput } from "@/engine/types";

export interface ReplacementComparisonRow {
  id: string;
  name: string;
  price: number;
  monthlySaving: number;
  financeRequired: number;
  monthlyInstalment: number;
  paybackMonths: number;
  tenYearSaving: number;
  investmentScore: number;
  isSelected: boolean;
}

export function computeReplacementComparison(input: BusinessCaseInput): ReplacementComparisonRow[] {
  return input.replacements
    .filter((vehicle) => vehicle.name.trim() && vehicle.price > 0)
    .map((vehicle) => {
      const snapshot: BusinessCaseInput = {
        ...input,
        selectedReplacementId: vehicle.id,
      };
      const result = runFullBusinessCase(snapshot);
      const finance = result.finance.find((f) => f.vehicleId === vehicle.id);

      return {
        id: vehicle.id,
        name: vehicle.name,
        price: vehicle.price,
        monthlySaving: result.kpis.monthlySaving,
        financeRequired: result.tradeIn.amountFinanced,
        monthlyInstalment: finance?.monthlyInstalment ?? 0,
        paybackMonths: result.kpis.paybackMonths,
        tenYearSaving: result.kpis.tenYearSaving,
        investmentScore: result.decision.investmentScore.total,
        isSelected: vehicle.id === input.selectedReplacementId,
      };
    });
}
