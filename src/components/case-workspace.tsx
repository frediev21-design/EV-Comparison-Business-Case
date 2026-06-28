"use client";

import { useCaseStore, type WizardStep } from "@/store/case-store";
import { CurrentVehicleStep } from "@/components/wizard/current-vehicle-step";
import { ReplacementVehiclesStep } from "@/components/wizard/replacement-vehicles-step";
import { TradeInStep } from "@/components/wizard/trade-in-step";
import { FinanceStep } from "@/components/wizard/finance-step";
import { RunningCostsStep } from "@/components/wizard/running-costs-step";
import { SolarStep } from "@/components/wizard/solar-step";
import { OwnershipStep } from "@/components/wizard/ownership-step";
import { RiskStep } from "@/components/wizard/risk-step";
import { ExecutiveDashboard } from "@/components/dashboard/executive-dashboard";
import { ChartSuite } from "@/components/charts/chart-suite";
import { WhatIfPanel } from "@/components/what-if/what-if-panel";
import { ScenarioManager } from "@/components/scenarios/scenario-manager";
import { ReportPanel } from "@/components/reports/report-panel";
import { DecisionIntelligenceStep } from "@/components/decision/decision-intelligence-step";

const STEP_COMPONENTS: Record<WizardStep, React.ComponentType> = {
  current: CurrentVehicleStep,
  replacement: ReplacementVehiclesStep,
  "trade-in": TradeInStep,
  finance: FinanceStep,
  "running-costs": RunningCostsStep,
  solar: SolarStep,
  ownership: OwnershipStep,
  risk: RiskStep,
  dashboard: ExecutiveDashboard,
  decision: DecisionIntelligenceStep,
  charts: ChartSuite,
  "what-if": WhatIfPanel,
  scenarios: ScenarioManager,
  reports: ReportPanel,
};

export function CaseWorkspace() {
  const activeStep = useCaseStore((s) => s.activeStep);
  const Component = STEP_COMPONENTS[activeStep];

  return <Component />;
}
