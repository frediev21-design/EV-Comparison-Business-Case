"use client";

import { useCaseStore } from "@/store/case-store";
import { ExecutiveScoreCard } from "@/components/decision/executive-score-card";
import { DecisionTrafficLight } from "@/components/decision/decision-traffic-light";
import { BoardSummaryPanel } from "@/components/decision/board-summary-panel";
import { KpiCard } from "@/components/kpi/kpi-card";
import { ChartSuite } from "@/components/charts/chart-suite";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { X, Presentation } from "lucide-react";

export function PresentationView() {
  const decision = useCaseStore((s) => s.result.decision);
  const kpis = useCaseStore((s) => s.result.kpis);
  const tradeIn = useCaseStore((s) => s.result.tradeIn);
  const solar = useCaseStore((s) => s.result.solar);
  const selected = useCaseStore((s) =>
    s.input.replacements.find((v) => v.id === s.input.selectedReplacementId)
  );
  const setPresentationMode = useCaseStore((s) => s.setPresentationMode);
  const caseName = useCaseStore((s) => s.caseName);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Presentation className="h-5 w-5 text-accent" />
          <div>
            <h1 className="font-semibold">{caseName}</h1>
            <p className="text-xs text-muted-foreground">Board Presentation Mode</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setPresentationMode(false)}>
          <X className="mr-2 h-4 w-4" />
          Exit Presentation
        </Button>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
        <ExecutiveScoreCard score={decision.investmentScore} />
        <DecisionTrafficLight trafficLight={decision.trafficLight} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Investment Score" value={`${decision.investmentScore.total}/100`} />
          <KpiCard title="Monthly Saving" value={formatCurrency(kpis.monthlySaving)} positiveIsGood />
          <KpiCard title="Annual Saving" value={formatCurrency(kpis.annualSaving)} positiveIsGood />
          <KpiCard title="10-Year Saving" value={formatCurrency(kpis.tenYearSaving)} positiveIsGood />
          <KpiCard title="Finance Required" value={formatCurrency(tradeIn.amountFinanced)} />
          <KpiCard title="Trade Equity" value={formatCurrency(tradeIn.tradeEquity)} />
          <KpiCard title="Solar Contribution" value={`${solar.solarContributionPercent.toFixed(0)}%`} />
          <KpiCard title="Break-even" value={kpis.paybackMonths > 0 ? `${kpis.paybackMonths} mo` : "N/A"} />
        </div>

        <BoardSummaryPanel summary={decision.boardSummary} />
        <RecommendationCard />
        <div className="print:break-before-page">
          <ChartSuite compact />
        </div>
        <p className="text-center text-xs text-muted-foreground">
          {selected?.name} · Executive Investment Analysis · Confidential
        </p>
      </div>
    </div>
  );
}
