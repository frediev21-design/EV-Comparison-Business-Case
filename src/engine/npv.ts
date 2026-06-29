import type { FinanceResult } from "./types";

export function financePaymentForMonth(
  finance: FinanceResult | undefined,
  month: number
): number {
  if (!finance || month < 1) return 0;
  return finance.schedule[month - 1]?.payment ?? 0;
}

export function calculateComparisonNpv(
  horizonYears: number,
  currentFinance: FinanceResult | undefined,
  replacementFinance: FinanceResult | undefined,
  currentRunningForYear: (year: number) => number,
  replacementRunningForYear: (year: number) => number,
  currentResale: number,
  replacementResale: number,
  discountRatePercent: number
): number {
  const months = horizonYears * 12;
  const monthlyRate = discountRatePercent / 100 / 12;
  let npv = 0;

  for (let month = 1; month <= months; month++) {
    const year = Math.ceil(month / 12);
    const currentCost =
      financePaymentForMonth(currentFinance, month) + currentRunningForYear(year) / 12;
    const replacementCost =
      financePaymentForMonth(replacementFinance, month) + replacementRunningForYear(year) / 12;
    const delta = currentCost - replacementCost;
    npv += delta / Math.pow(1 + monthlyRate, month);
  }

  const resaleDelta = currentResale - replacementResale;
  npv += resaleDelta / Math.pow(1 + monthlyRate, months);

  return npv;
}
