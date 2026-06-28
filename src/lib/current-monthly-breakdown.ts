import { calculateCurrentRunningCosts } from "@/engine/running-costs";
import { resolveCurrentFinanceInstalment } from "@/engine/current-finance";
import type { BusinessCaseInput, RunningCostBreakdown } from "@/engine/types";

export interface CurrentMonthlyBreakdownLine {
  label: string;
  annual: number;
  monthly: number;
  source: string;
}

export interface CurrentMonthlyBreakdown {
  instalment: number;
  enteredInstalment: number;
  instalmentAdjusted: boolean;
  running: RunningCostBreakdown;
  operatingMonthly: number;
  totalMonthly: number;
  lines: CurrentMonthlyBreakdownLine[];
}

/** Monthly cost breakdown using Current Vehicle form fields + assumptions on that step. */
export function buildCurrentMonthlyFromInputs(input: BusinessCaseInput): CurrentMonthlyBreakdown {
  const { current, assumptions } = input;
  const running = calculateCurrentRunningCosts(current, assumptions);
  const enteredInstalment = Math.max(0, current.monthlyInstalment);
  const instalment = resolveCurrentFinanceInstalment(current);
  const instalmentAdjusted = instalment !== enteredInstalment;
  const operatingMonthly = running.total / 12;

  const fuelSource =
    current.fuelType === "electric"
      ? "Electric — no fuel cost"
      : `${assumptions.dailyDistanceKm} km/day · ${current.fuelConsumption} L/100km · R${assumptions.fuelPricePerLitre}/L`;

  const lines: CurrentMonthlyBreakdownLine[] = [
    {
      label: "Fuel",
      annual: running.fuel,
      monthly: running.fuel / 12,
      source: fuelSource,
    },
    {
      label: "Maintenance",
      annual: running.maintenance,
      monthly: running.maintenance / 12,
      source: `You entered R${current.maintenance.toLocaleString()}/yr`,
    },
    {
      label: "Insurance",
      annual: running.insurance,
      monthly: running.insurance / 12,
      source: `You entered R${current.insurance.toLocaleString()}/yr`,
    },
    {
      label: "Tyres",
      annual: running.tyres,
      monthly: running.tyres / 12,
      source: `You entered R${current.tyres.toLocaleString()}/yr`,
    },
    {
      label: "Licence",
      annual: running.licence,
      monthly: running.licence / 12,
      source: `You entered R${current.licence.toLocaleString()}/yr`,
    },
    {
      label: "Repairs",
      annual: running.repairs,
      monthly: running.repairs / 12,
      source: `You entered R${current.expectedAnnualRepairs.toLocaleString()}/yr`,
    },
  ].filter((line) => line.annual > 0);

  return {
    instalment,
    enteredInstalment,
    instalmentAdjusted,
    running,
    operatingMonthly,
    totalMonthly: instalment + operatingMonthly,
    lines,
  };
}

export function formatCurrentVehicleSummary(input: BusinessCaseInput): string {
  const { current } = input;
  return `${current.manufacturer} ${current.model} (${current.year})`;
}
