import type { CurrentVehicle } from "./types";
import { calculateMonthlyPayment } from "./finance";

/**
 * Returns the loan instalment to use in monthly KPI comparisons.
 * If the stored instalment is far above what the outstanding balance can
 * reasonably support, it likely includes fuel/maintenance (total monthly cost)
 * and we estimate the finance payment instead to avoid double-counting running costs.
 */
export function resolveCurrentFinanceInstalment(
  current: Pick<CurrentVehicle, "monthlyInstalment" | "outstandingFinance">
): number {
  const { monthlyInstalment, outstandingFinance } = current;
  if (outstandingFinance <= 0) return Math.max(0, monthlyInstalment);

  const plausibleCeiling = calculateMonthlyPayment(outstandingFinance, 14, 42) * 2;
  if (monthlyInstalment <= plausibleCeiling) {
    return monthlyInstalment;
  }

  return calculateMonthlyPayment(outstandingFinance, 10, 72);
}
