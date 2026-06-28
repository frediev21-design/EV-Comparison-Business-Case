"use client";

import { useCaseStore, type WizardStep } from "@/store/case-store";
import { AnimatePresence, motion } from "framer-motion";
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
import { MarketIntelligenceStep } from "@/components/market/market-intelligence-step";
import { WizardStepShell } from "@/components/wizard/wizard-step-shell";

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
  market: MarketIntelligenceStep,
  charts: ChartSuite,
  "what-if": WhatIfPanel,
  scenarios: ScenarioManager,
  reports: ReportPanel,
};

export function CaseWorkspace() {
  const activeStep = useCaseStore((s) => s.activeStep);
  const inputGeneration = useCaseStore((s) => s.inputGeneration);
  const Component = STEP_COMPONENTS[activeStep];

  return (
    <WizardStepShell step={activeStep}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeStep}-${inputGeneration}`}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Component />
        </motion.div>
      </AnimatePresence>
    </WizardStepShell>
  );
}
