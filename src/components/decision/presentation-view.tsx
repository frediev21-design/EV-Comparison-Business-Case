"use client";

import { useCaseStore } from "@/store/case-store";
import { buildVehicleComparisonLabel } from "@/lib/case-labels";
import { ExecutiveDashboardHero } from "@/components/dashboard/executive-dashboard-hero";
import { DashboardKpiStrip } from "@/components/dashboard/dashboard-kpi-strip";
import { BoardSummaryPanel } from "@/components/decision/board-summary-panel";
import { ChartSuite } from "@/components/charts/chart-suite";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { MonthlyRepaymentComparisonCard } from "@/components/dashboard/monthly-repayment-comparison-card";
import { ModelDisclaimer } from "@/components/dashboard/model-disclaimer";
import { Button } from "@/components/ui/button";
import { X, Presentation } from "lucide-react";

export function PresentationView() {
  const decision = useCaseStore((s) => s.result.decision);
  const kpis = useCaseStore((s) => s.result.kpis);
  const tradeIn = useCaseStore((s) => s.result.tradeIn);
  const input = useCaseStore((s) => s.input);
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
  const setPresentationMode = useCaseStore((s) => s.setPresentationMode);
  const caseName = useCaseStore((s) => s.caseName);
  const comparisonLabel = buildVehicleComparisonLabel(input).replace(" → ", " vs ");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Presentation className="h-5 w-5 text-accent" />
          <div>
            <h1 className="font-semibold">{caseName}</h1>
            <p className="text-xs text-muted-foreground">Total Cost of Ownership — {comparisonLabel}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setPresentationMode(false)}>
          <X className="mr-2 h-4 w-4" />
          Exit Presentation
        </Button>
      </div>

      <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
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

        <MonthlyRepaymentComparisonCard compact />
        <BoardSummaryPanel summary={decision.boardSummary} />
        <RecommendationCard />
        <div className="print:break-before-page">
          <ChartSuite compact />
        </div>
        <ModelDisclaimer variant="short" className="text-center" />
        <p className="text-center text-xs text-muted-foreground">
          {selected?.name} · Executive Investment Analysis · Confidential
        </p>
      </div>
    </div>
  );
}
