import type {
  FinanceResult,
  OwnershipHorizon,
  OwnershipResult,
  RunningCostBreakdown,
} from "./types";
import { kmMultiplierForYear } from "./ownership-utils";

const HORIZONS = [5, 7, 10];

function totalKmOverHorizon(dailyKm: number, years: number, annualKmGrowth: number): number {
  let total = 0;
  for (let year = 1; year <= years; year++) {
    total += dailyKm * 365 * kmMultiplierForYear(year, annualKmGrowth);
  }
  return total;
}

/** Splits running costs into distance-sensitive (fuel, electricity) and fixed annual lines. */
export function runningTotalForYear(
  running: RunningCostBreakdown,
  kmMultiplier: number
): number {
  const variable = running.fuel + running.electricity;
  const fixed = running.total - variable;
  return fixed + variable * kmMultiplier;
}

export function runningTotalOverHorizon(
  running: RunningCostBreakdown,
  years: number,
  annualKmGrowth: number
): number {
  let total = 0;
  for (let year = 1; year <= years; year++) {
    total += runningTotalForYear(running, kmMultiplierForYear(year, annualKmGrowth));
  }
  return total;
}

function computeHorizon(
  years: number,
  finance: FinanceResult | undefined,
  running: RunningCostBreakdown,
  resale: number,
  dailyKm: number,
  annualKmGrowth: number
): OwnershipHorizon {
  const months = years * 12;
  const financePayments =
    finance?.schedule.slice(0, months).reduce((sum, row) => sum + row.payment, 0) ?? 0;
  const runningTotal = runningTotalOverHorizon(running, years, annualKmGrowth);
  const totalCost = financePayments + runningTotal;
  const totalKm = totalKmOverHorizon(dailyKm, years, annualKmGrowth);
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
  dailyKm: number,
  currentFinance?: FinanceResult,
  annualKmGrowth = 0
): OwnershipResult {
  const current = HORIZONS.map((years) =>
    computeHorizon(
      years,
      currentFinance,
      currentRunning,
      currentResale,
      dailyKm,
      annualKmGrowth
    )
  );

  const replacements: Record<string, OwnershipHorizon[]> = {};
  for (const finance of financeResults) {
    const running = replacementRunning[finance.vehicleId];
    const resale = replacementResales[finance.vehicleId] ?? 0;
    replacements[finance.vehicleId] = HORIZONS.map((years) =>
      computeHorizon(years, finance, running, resale, dailyKm, annualKmGrowth)
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
