import type {
  BusinessCaseInput,
  ComparisonKpis,
  FinanceResult,
  OwnershipResult,
  RunningCostResult,
  SolarResult,
} from "./types";
import { resolveCurrentFinanceInstalment } from "./current-finance";
import { getFleetCount } from "./fleet";
import { getOwnershipForHorizon } from "./ownership";

export function calculateKpis(
  input: BusinessCaseInput,
  financeResults: FinanceResult[],
  running: RunningCostResult,
  solar: SolarResult,
  ownership: OwnershipResult
): ComparisonKpis {
  const selectedId = input.selectedReplacementId;
  const selectedFinance = financeResults.find((f) => f.vehicleId === selectedId);
  const selectedRunning = running.replacements[selectedId];
  const currentHorizon = getOwnershipForHorizon(ownership, "current", 10);
  const replacementHorizon = getOwnershipForHorizon(ownership, selectedId, 10);

  const currentFinanceInstalment = resolveCurrentFinanceInstalment(input.current);
  const currentRunningMonthly = running.current.total / 12;
  const replacementFinanceInstalment = selectedFinance?.monthlyInstalment ?? 0;
  const replacementRunningMonthly = (selectedRunning?.total ?? 0) / 12;

  const currentMonthlyCost = currentFinanceInstalment + currentRunningMonthly;
  const replacementMonthlyCost = replacementFinanceInstalment + replacementRunningMonthly;
  const monthlySaving = currentMonthlyCost - replacementMonthlyCost;
  const operatingMonthlySaving = currentRunningMonthly - replacementRunningMonthly;
  const financeMonthlyDelta = currentFinanceInstalment - replacementFinanceInstalment;
  const annualSaving = monthlySaving * 12;
  const tenYearSaving =
    (currentHorizon?.netOwnershipCost ?? 0) - (replacementHorizon?.netOwnershipCost ?? 0);

  const financeBalance =
    selectedFinance?.schedule[selectedFinance.schedule.length - 1]?.balance ?? 0;

  const costPerKmCurrent = currentHorizon?.costPerKm ?? 0;
  const costPerKmReplacement = replacementHorizon?.costPerKm ?? 0;

  const upgradeCost = (selectedFinance?.amountFinanced ?? 0) - input.current.outstandingFinance;
  const roi = upgradeCost > 0 ? (tenYearSaving / upgradeCost) * 100 : 0;
  const paybackMonths =
    monthlySaving > 0
      ? Math.ceil(
          Math.max(0, (selectedFinance?.amountFinanced ?? 0) - input.tradeIn.additionalCashDeposit) /
            monthlySaving
        )
      : 0;

  const selectedVehicle = input.replacements.find((v) => v.id === selectedId);

  return {
    currentMonthlyCost,
    replacementMonthlyCost,
    currentFinanceInstalment,
    currentRunningMonthly,
    replacementFinanceInstalment,
    replacementRunningMonthly,
    operatingMonthlySaving,
    financeMonthlyDelta,
    monthlySaving,
    annualSaving,
    tenYearSaving,
    financeBalance,
    solarSaving: solar.fuelSavingsVsBaseline,
    fuelSaving: running.current.fuel - (selectedRunning?.fuel ?? 0),
    costPerKmCurrent,
    costPerKmReplacement,
    roi,
    paybackMonths,
    batteryWarrantyRemainingYears: selectedVehicle?.batteryWarrantyYears ?? 0,
    fleetVehicleCount: getFleetCount(input.assumptions, input.whatIf),
  };
}
