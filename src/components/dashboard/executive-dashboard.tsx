"use client";

import { useCaseStore } from "@/store/case-store";
import { getCaseValidationMessages } from "@/lib/wizard-validation";
import { ValidationAlerts } from "@/components/wizard/validation-alerts";
import { KpiCard } from "@/components/kpi/kpi-card";
import { formatCurrency } from "@/lib/format";
import { RecommendationCard } from "./recommendation-card";
import { SavingsBreakdownCard } from "./savings-breakdown-card";
import { ExecutiveScoreCard } from "@/components/decision/executive-score-card";
import { DecisionTrafficLight } from "@/components/decision/decision-traffic-light";
import { BoardSummaryPanel } from "@/components/decision/board-summary-panel";
import { RiskMatrixDashboard } from "@/components/decision/risk-matrix-dashboard";
import { SwotPanel } from "@/components/decision/swot-panel";
import { DecisionTimeline } from "@/components/decision/decision-timeline";
import { DecisionAdvisor } from "@/components/decision/decision-advisor";

export function ExecutiveDashboard() {
  const input = useCaseStore((s) => s.input);
  const kpis = useCaseStore((s) => s.result.kpis);
  const result = useCaseStore((s) => s.result);
  const decision = result.decision;
  const tradeIn = result.tradeIn;
  const solar = result.solar;
  const validationMessages = getCaseValidationMessages(input, result);
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
  const currentName = `${input.current.manufacturer} ${input.current.model}`;

  return (
    <div className="space-y-8">
      <ValidationAlerts messages={validationMessages} />
      <div>
        <h2 className="text-xl font-bold tracking-tight">Executive Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Investment decision intelligence · {currentName} vs {selected?.name ?? ""}
        </p>
      </div>

      <ExecutiveScoreCard score={decision.investmentScore} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DecisionTrafficLight trafficLight={decision.trafficLight} />
        </div>
        <KpiCard
          title="Investment Score"
          value={`${decision.investmentScore.total}/100`}
          subtitle={decision.investmentScore.rating}
        />
      </div>

      <SavingsBreakdownCard />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 max-sm:flex max-sm:gap-4 max-sm:overflow-x-auto max-sm:pb-2 max-sm:snap-x max-sm:snap-mandatory">
        <KpiCard title="Monthly Saving" value={formatCurrency(kpis.monthlySaving)} positiveIsGood className="max-sm:min-w-[240px] max-sm:snap-center" />
        <KpiCard title="Annual Saving" value={formatCurrency(kpis.annualSaving)} positiveIsGood className="max-sm:min-w-[240px] max-sm:snap-center" />
        <KpiCard title="10-Year Saving" value={formatCurrency(kpis.tenYearSaving)} positiveIsGood />
        <KpiCard title="Finance Required" value={formatCurrency(tradeIn.amountFinanced)} />
        <KpiCard title="Trade Equity" value={formatCurrency(tradeIn.tradeEquity)} />
        <KpiCard title="Solar Contribution" value={`${solar.solarContributionPercent.toFixed(0)}%`} subtitle="of charging" />
        <KpiCard title="Fuel Saving" value={formatCurrency(kpis.fuelSaving)} subtitle="annual" positiveIsGood />
        <KpiCard title="Break-even Point" value={kpis.paybackMonths > 0 ? `${kpis.paybackMonths} months` : "N/A"} />
        <KpiCard title="Net Cost per km" value={`R${kpis.costPerKmReplacement.toFixed(2)}`} subtitle="replacement" />
        <KpiCard title="Warranty Remaining" value={`${kpis.batteryWarrantyRemainingYears} years`} subtitle="battery" />
        <KpiCard title="Estimated Resale" value={formatCurrency(selected?.expectedResale ?? 0)} />
        <KpiCard title="Current Vehicle Cost" value={formatCurrency(kpis.currentMonthlyCost)} subtitle="per month" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BoardSummaryPanel summary={decision.boardSummary} />
        <DecisionAdvisor tips={decision.advisorTips} />
      </div>

      <RecommendationCard />

      <SwotPanel swot={decision.swot} />
      <RiskMatrixDashboard items={decision.riskMatrix} />
      <DecisionTimeline events={decision.timeline} />
    </div>
  );
}
