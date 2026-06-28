import type {
  FinanceResult,
  OwnershipHorizon,
  OwnershipResult,
  RunningCostBreakdown,
} from "./types";

const HORIZONS = [5, 7, 10];

function computeHorizon(
  years: number,
  finance: FinanceResult | undefined,
  running: RunningCostBreakdown,
  resale: number,
  dailyKm: number
): OwnershipHorizon {
  const months = years * 12;
  const financePayments =
    finance?.schedule.slice(0, months).reduce((sum, row) => sum + row.payment, 0) ?? 0;
  const runningTotal = running.total * years;
  const totalCost = financePayments + runningTotal;
  const totalKm = dailyKm * 365 * years;
  const netOwnershipCost = totalCost - resale;

  return {
    years,
    monthlyCost: totalCost / months,
    annualCost: totalCost / years,
    totalCost,
    costPerKm: totalKm > 0 ? totalCost / totalKm : 0,
    costPerDay: totalCost / (years * 365),
    netOwnershipCost,
    ownershipAfterResale: netOwnershipCost,
  };
}

export function calculateOwnership(
  currentRunning: RunningCostBreakdown,
  replacementRunning: Record<string, RunningCostBreakdown>,
  financeResults: FinanceResult[],
  currentResale: number,
  replacementResales: Record<string, number>,
  dailyKm: number
): OwnershipResult {
  const current = HORIZONS.map((years) =>
    computeHorizon(years, undefined, currentRunning, currentResale, dailyKm)
  );

  const replacements: Record<string, OwnershipHorizon[]> = {};
  for (const finance of financeResults) {
    const running = replacementRunning[finance.vehicleId];
    const resale = replacementResales[finance.vehicleId] ?? 0;
    replacements[finance.vehicleId] = HORIZONS.map((years) =>
      computeHorizon(years, finance, running, resale, dailyKm)
    );
  }

  return { current, replacements };
}

export function getOwnershipForHorizon(
  ownership: OwnershipResult,
  vehicleId: string | "current",
  years: number
): OwnershipHorizon | undefined {
  if (vehicleId === "current") {
    return ownership.current.find((h) => h.years === years);
  }
  return ownership.replacements[vehicleId]?.find((h) => h.years === years);
}
