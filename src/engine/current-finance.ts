import type { AmortisationRow, CurrentVehicle, FinanceResult } from "./types";
import { calculateMonthlyPayment } from "./finance";

const DEFAULT_CURRENT_RATE = 10;

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

  return calculateMonthlyPayment(outstandingFinance, DEFAULT_CURRENT_RATE, 72);
}

function buildScheduleFromPayment(
  principal: number,
  payment: number,
  annualRatePercent: number,
  maxMonths = 96
): AmortisationRow[] {
  const monthlyRate = annualRatePercent / 100 / 12;
  let balance = principal;
  const schedule: AmortisationRow[] = [];

  for (let month = 1; month <= maxMonths && balance > 0.01; month++) {
    const interest = balance * monthlyRate;
    const capital = Math.min(Math.max(0, payment - interest), balance);
    if (month === 1 && payment <= interest && principal > 0) break;
    balance = Math.max(0, balance - capital);
    schedule.push({ month, payment, interest, capital, balance });
  }

  return schedule;
}

/** Builds a finance schedule for the current vehicle's outstanding loan. */
export function buildCurrentFinanceResult(
  current: CurrentVehicle
): FinanceResult | undefined {
  if (current.outstandingFinance <= 0) return undefined;

  const monthlyInstalment = resolveCurrentFinanceInstalment(current);
  const schedule = buildScheduleFromPayment(
    current.outstandingFinance,
    monthlyInstalment,
    DEFAULT_CURRENT_RATE
  );
  if (schedule.length === 0) return undefined;

  const totalPayments = schedule.reduce((sum, row) => sum + row.payment, 0);
  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);

  return {
    vehicleId: "current",
    vehicleName: `${current.manufacturer} ${current.model}`,
    amountFinanced: current.outstandingFinance,
    monthlyInstalment,
    totalInterest,
    totalPayments,
    schedule,
  };
}
