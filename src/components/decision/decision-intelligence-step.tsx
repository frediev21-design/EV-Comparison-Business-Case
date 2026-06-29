"use client";

import { useCaseStore } from "@/store/case-store";
import { ExecutiveDashboardHero } from "@/components/dashboard/executive-dashboard-hero";
import { DashboardKpiStrip } from "@/components/dashboard/dashboard-kpi-strip";
import { BoardSummaryPanel } from "@/components/decision/board-summary-panel";
import { RiskMatrixDashboard } from "@/components/decision/risk-matrix-dashboard";
import { SwotPanel } from "@/components/decision/swot-panel";
import { DecisionTimeline } from "@/components/decision/decision-timeline";
import { DecisionAdvisor } from "@/components/decision/decision-advisor";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";

export function DecisionIntelligenceStep() {
  const decision = useCaseStore((s) => s.result.decision);
  const kpis = useCaseStore((s) => s.result.kpis);
  const tradeIn = useCaseStore((s) => s.result.tradeIn);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Executive Decision Intelligence</h2>
        <p className="text-sm text-muted-foreground">
          Weighted investment scoring and board-level decision support.
        </p>
      </div>

      <ExecutiveDashboardHero
        score={decision.investmentScore}
        trafficLight={decision.trafficLight}
      />

      <DashboardKpiStrip
        monthlySaving={kpis.monthlySaving}
        amountFinanced={tradeIn.amountFinanced}
        tenYearSaving={kpis.tenYearSaving}
        paybackMonths={kpis.paybackMonths}
      />

      <BoardSummaryPanel summary={decision.boardSummary} />
      <RecommendationCard />
      <SwotPanel swot={decision.swot} />
      <RiskMatrixDashboard items={decision.riskMatrix} />
      <DecisionTimeline events={decision.timeline} />
      <DecisionAdvisor tips={decision.advisorTips} />
    </div>
  );
}
