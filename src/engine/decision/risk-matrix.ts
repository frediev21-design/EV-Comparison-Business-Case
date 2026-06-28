import type { BusinessCaseInput, ComparisonKpis, RunningCostResult, SolarResult } from "../types";
import type { RiskMatrixItem } from "./types";

function levelFromScore(score: number): "green" | "amber" | "red" {
  if (score >= 70) return "green";
  if (score >= 40) return "amber";
  return "red";
}

export function buildRiskMatrix(
  input: BusinessCaseInput,
  kpis: ComparisonKpis,
  running: RunningCostResult,
  solar: SolarResult
): RiskMatrixItem[] {
  const current = input.current;
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
  const selectedRunning = running.replacements[input.selectedReplacementId];
  const currentYear = new Date().getFullYear();
  const age = currentYear - current.year;

  const items: RiskMatrixItem[] = [
    {
      id: "fuel-price",
      label: "Fuel Price Risk",
      category: "current",
      level: current.fuelType === "diesel" || current.fuelType === "petrol" ? "red" : "amber",
      description: "Exposure to volatile fuel prices on ICE powertrain",
    },
    {
      id: "maint-current",
      label: "Maintenance Risk",
      category: "current",
      level: age > 5 || current.mileage > 120000 ? "red" : "amber",
      description: "Age and mileage increase scheduled and unscheduled maintenance",
    },
    {
      id: "mechanical",
      label: "Mechanical Failure",
      category: "current",
      level: current.hasTurbo || current.hasDpf ? "red" : "amber",
      description: "Turbo, DPF, and high-mileage components elevate failure risk",
    },
    {
      id: "warranty-current",
      label: "Warranty Risk",
      category: "current",
      level: current.warrantyExpired ? "red" : "green",
      description: current.warrantyExpired
        ? "Manufacturer warranty expired — repairs at owner cost"
        : "Some warranty coverage may remain",
    },
    {
      id: "downtime",
      label: "Downtime Risk",
      category: "current",
      level: current.expectedAnnualRepairs > 12000 ? "amber" : "green",
      description: "Repair frequency impacts fleet availability",
    },
    {
      id: "resale-current",
      label: "Resale Risk",
      category: "current",
      level: current.mileage > 150000 ? "amber" : "green",
      description: "Depreciation accelerates at higher mileage",
    },
  ];

  if (selected) {
    items.push(
      {
        id: "finance",
        label: "Finance Risk",
        category: "replacement",
        level: levelFromScore(100 - (kpis.financeBalance / Math.max(selected.price, 1)) * 100),
        description: `R${kpis.financeBalance.toLocaleString()} end-of-term balance exposure`,
      },
      {
        id: "battery",
        label: "Battery Risk",
        category: "replacement",
        level: selected.batteryWarrantyYears >= 8 ? "green" : "amber",
        description: `${selected.batteryWarrantyYears}-year battery warranty coverage`,
      },
      {
        id: "charging",
        label: "Charging Risk",
        category: "replacement",
        level:
          selected.fuelType === "electric" && solar.solarContributionPercent < 30
            ? "amber"
            : "green",
        description: "Grid dependence vs solar-assisted charging profile",
      },
      {
        id: "technology",
        label: "Technology Risk",
        category: "replacement",
        level: selected.fuelType === "electric" ? "amber" : "green",
        description: "Rapid EV technology evolution may affect long-term resale",
      },
      {
        id: "warranty-replacement",
        label: "Warranty Coverage",
        category: "replacement",
        level: selected.warrantyYears >= 5 ? "green" : "amber",
        description: `${selected.warrantyYears}-year comprehensive warranty`,
      },
      {
        id: "maint-replacement",
        label: "Maintenance Risk",
        category: "replacement",
        level:
          (selectedRunning?.maintenance ?? 0) < current.maintenance ? "green" : "amber",
        description: "Predictable lower maintenance vs ageing ICE vehicle",
      }
    );
  }

  return items;
}
