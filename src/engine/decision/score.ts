import type {
  BusinessCaseInput,
  ComparisonKpis,
  OwnershipResult,
  RiskResult,
  RunningCostResult,
  SolarResult,
  TradeInResult,
} from "../types";
import type { InvestmentScore, ScoreCriterion, TrafficLight, TrafficLightStatus } from "./types";
import { clampScore, getScoreRating } from "./utils";

const WEIGHTS = {
  financialImpact: 0.35,
  monthlyCashFlow: 0.2,
  runningCosts: 0.15,
  vehicleReliability: 0.1,
  warrantyProtection: 0.05,
  maintenanceRisk: 0.05,
  environmentalImpact: 0.05,
  futureResaleValue: 0.05,
} as const;

function scoreFinancialImpact(kpis: ComparisonKpis, amountFinanced: number): number {
  const roiScore = clampScore(kpis.roi);
  const savingScore = clampScore(50 + (kpis.tenYearSaving / Math.max(amountFinanced, 1)) * 50);
  return clampScore(roiScore * 0.4 + savingScore * 0.6);
}

function scoreMonthlyCashFlow(kpis: ComparisonKpis): number {
  if (kpis.monthlySaving <= 0) return clampScore(30 + kpis.monthlySaving / 200);
  return clampScore(55 + (kpis.monthlySaving / 8000) * 45);
}

function scoreRunningCosts(running: RunningCostResult, selectedId: string): number {
  const current = running.current.total;
  const replacement = running.replacements[selectedId]?.total ?? current;
  if (current <= 0) return replacement > 0 ? 45 : 50;
  if (replacement >= current) return clampScore(40 - ((replacement - current) / current) * 40);
  return clampScore(60 + ((current - replacement) / current) * 40);
}

function scoreVehicleReliability(risk: RiskResult, selectedId: string): number {
  const currentHigh = risk.current.filter((f) => f.level === "high").length;
  const replacementPositive = (risk.replacements[selectedId] ?? []).filter(
    (f) => f.level === "positive"
  ).length;
  return clampScore(100 - currentHigh * 12 + replacementPositive * 5);
}

function scoreWarranty(selected: BusinessCaseInput["replacements"][0] | undefined): number {
  if (!selected) return 50;
  return clampScore(selected.batteryWarrantyYears * 10 + selected.warrantyYears * 6);
}

function scoreMaintenanceRisk(running: RunningCostResult, selectedId: string): number {
  const currentMaint =
    running.current.maintenance + running.current.repairs + running.current.tyres;
  const replacementMaint =
    (running.replacements[selectedId]?.maintenance ?? 0) +
    (running.replacements[selectedId]?.repairs ?? 0) +
    (running.replacements[selectedId]?.tyres ?? 0);
  if (currentMaint === 0) return 70;
  const saving = currentMaint - replacementMaint;
  return clampScore(50 + (saving / currentMaint) * 50);
}

function scoreEnvironmental(selected: BusinessCaseInput["replacements"][0] | undefined): number {
  if (!selected) return 50;
  const map = { electric: 100, phev: 85, hybrid: 65, petrol: 35, diesel: 25 };
  return map[selected.fuelType] ?? 50;
}

function scoreResale(selected: BusinessCaseInput["replacements"][0] | undefined): number {
  if (!selected || selected.price === 0) return 50;
  return clampScore((selected.expectedResale / selected.price) * 120);
}

export function calculateInvestmentScore(
  input: BusinessCaseInput,
  kpis: ComparisonKpis,
  running: RunningCostResult,
  risk: RiskResult,
  tradeIn: TradeInResult
): InvestmentScore {
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
  const selectedId = input.selectedReplacementId;

  const rawCriteria: Omit<ScoreCriterion, "weightedScore">[] = [
    {
      id: "financialImpact",
      label: "Financial Impact",
      weight: WEIGHTS.financialImpact,
      score: scoreFinancialImpact(kpis, tradeIn.amountFinanced),
    },
    {
      id: "monthlyCashFlow",
      label: "Monthly Cash Flow",
      weight: WEIGHTS.monthlyCashFlow,
      score: scoreMonthlyCashFlow(kpis),
    },
    {
      id: "runningCosts",
      label: "Running Costs",
      weight: WEIGHTS.runningCosts,
      score: scoreRunningCosts(running, selectedId),
    },
    {
      id: "vehicleReliability",
      label: "Vehicle Reliability",
      weight: WEIGHTS.vehicleReliability,
      score: scoreVehicleReliability(risk, selectedId),
    },
    {
      id: "warrantyProtection",
      label: "Warranty Protection",
      weight: WEIGHTS.warrantyProtection,
      score: scoreWarranty(selected),
    },
    {
      id: "maintenanceRisk",
      label: "Maintenance Risk",
      weight: WEIGHTS.maintenanceRisk,
      score: scoreMaintenanceRisk(running, selectedId),
    },
    {
      id: "environmentalImpact",
      label: "Environmental Impact",
      weight: WEIGHTS.environmentalImpact,
      score: scoreEnvironmental(selected),
    },
    {
      id: "futureResaleValue",
      label: "Future Resale Value",
      weight: WEIGHTS.futureResaleValue,
      score: scoreResale(selected),
    },
  ];

  const criteria: ScoreCriterion[] = rawCriteria.map((c) => ({
    ...c,
    weightedScore: c.score * c.weight,
  }));

  const total = Math.round(criteria.reduce((sum, c) => sum + c.weightedScore, 0));
  const safeTotal = Number.isFinite(total) ? total : 0;
  const { stars, rating, subtitle } = getScoreRating(safeTotal);

  return { total: safeTotal, stars, rating, subtitle, criteria };
}

export function calculateTrafficLight(score: number, kpis: ComparisonKpis): TrafficLight {
  let status: TrafficLightStatus = "review";
  if (score >= 85 && kpis.monthlySaving >= 0) status = "go";
  else if (score < 65 || kpis.monthlySaving < -2000) status = "stop";

  const map: Record<TrafficLightStatus, TrafficLight> = {
    go: {
      status: "go",
      label: "GO",
      description: "Financially Strong — investment meets executive thresholds",
    },
    review: {
      status: "review",
      label: "REVIEW",
      description: "Requires Further Analysis — validate assumptions before proceeding",
    },
    stop: {
      status: "stop",
      label: "DO NOT PROCEED",
      description: "Investment Not Recommended under current assumptions",
    },
  };

  return map[status];
}

export function buildBoardSummary(
  input: BusinessCaseInput,
  kpis: ComparisonKpis,
  tradeIn: TradeInResult,
  running: RunningCostResult,
  solar: SolarResult,
  ownership: OwnershipResult,
  recommendation: string
) {
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
  const selectedRunning = running.replacements[input.selectedReplacementId];
  const replacementHorizon = ownership.replacements[input.selectedReplacementId]?.find(
    (h) => h.years === 10
  );

  const maintenanceSavings = Math.max(
    0,
    running.current.maintenance +
      running.current.repairs -
      (selectedRunning?.maintenance ?? 0) -
      (selectedRunning?.repairs ?? 0)
  );

  return {
    currentSituation: `${input.current.manufacturer} ${input.current.model} (${input.current.year})`,
    proposedInvestment: selected?.name ?? "—",
    capitalRequired: tradeIn.vehiclePrice,
    amountFinanced: tradeIn.amountFinanced,
    monthlyCashFlow: kpis.replacementMonthlyCost,
    fuelSavings: kpis.fuelSaving,
    maintenanceSavings,
    solarSavings: solar.fuelSavingsVsBaseline,
    tenYearOwnershipCost: replacementHorizon?.totalCost ?? 0,
    tenYearSavings: kpis.tenYearSaving,
    overallRecommendation: recommendation,
  };
}
