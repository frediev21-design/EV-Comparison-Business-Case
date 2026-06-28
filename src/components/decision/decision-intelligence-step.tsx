"use client";

import { useCaseStore } from "@/store/case-store";
import { ExecutiveScoreCard } from "@/components/decision/executive-score-card";
import { DecisionTrafficLight, DecisionTrafficLightRow } from "@/components/decision/decision-traffic-light";
import { BoardSummaryPanel } from "@/components/decision/board-summary-panel";
import { RiskMatrixDashboard } from "@/components/decision/risk-matrix-dashboard";
import { SwotPanel } from "@/components/decision/swot-panel";
import { DecisionTimeline } from "@/components/decision/decision-timeline";
import { DecisionAdvisor } from "@/components/decision/decision-advisor";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";

export function DecisionIntelligenceStep() {
  const decision = useCaseStore((s) => s.result.decision);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Executive Decision Intelligence</h2>
        <p className="text-sm text-muted-foreground">
          ADDON-001 · Weighted investment scoring and board-level decision support
        </p>
      </div>

      <ExecutiveScoreCard score={decision.investmentScore} />
      <DecisionTrafficLight trafficLight={decision.trafficLight} />
      <DecisionTrafficLightRow />
      <BoardSummaryPanel summary={decision.boardSummary} />
      <RecommendationCard />
      <SwotPanel swot={decision.swot} />
      <RiskMatrixDashboard items={decision.riskMatrix} />
      <DecisionTimeline events={decision.timeline} />
      <DecisionAdvisor tips={decision.advisorTips} />
    </div>
  );
}
