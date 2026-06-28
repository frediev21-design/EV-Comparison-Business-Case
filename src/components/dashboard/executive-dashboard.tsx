"use client";

import { useCaseStore } from "@/store/case-store";
import { getCaseValidationMessages } from "@/lib/wizard-validation";
import { ValidationAlerts } from "@/components/wizard/validation-alerts";
import { KpiCard } from "@/components/kpi/kpi-card";
import { formatCurrency } from "@/lib/format";
import { DashboardHeroStrip } from "./dashboard-hero-strip";
import { RecommendationCard } from "./recommendation-card";
import { SavingsBreakdownCard } from "./savings-breakdown-card";
import { MonthlyRepaymentComparisonCard } from "./monthly-repayment-comparison-card";
import { CurrentMonthlyBreakdownCard } from "./current-monthly-breakdown-card";
import { buildCurrentMonthlyFromInputs } from "@/lib/current-monthly-breakdown";
import { downloadBoardPack } from "@/lib/export-pdf";
import { downloadExecutiveSummary } from "@/lib/executive-summary-pdf";
import { Button } from "@/components/ui/button";
import { FileDown, FileText } from "lucide-react";
import { showToast } from "@/lib/toast";
import { ExecutiveScoreCard } from "@/components/decision/executive-score-card";
import { DecisionTrafficLight } from "@/components/decision/decision-traffic-light";
import { BoardSummaryPanel } from "@/components/decision/board-summary-panel";
import { RiskMatrixDashboard } from "@/components/decision/risk-matrix-dashboard";
import { SwotPanel } from "@/components/decision/swot-panel";
import { DecisionTimeline } from "@/components/decision/decision-timeline";
import { DecisionAdvisor } from "@/components/decision/decision-advisor";
import { InfographicPromptPanel } from "./infographic-prompt-panel";
import { RecommendationSummaryCopyButton } from "./recommendation-summary-panel";

export function ExecutiveDashboard() {
  const input = useCaseStore((s) => s.input);
  const kpis = useCaseStore((s) => s.result.kpis);
  const result = useCaseStore((s) => s.result);
  const caseName = useCaseStore((s) => s.caseName);
  const decision = result.decision;
  const tradeIn = result.tradeIn;
  const solar = result.solar;
  const validationMessages = getCaseValidationMessages(input, result);
  const currentMonthlyFromInputs = buildCurrentMonthlyFromInputs(input);
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
  const currentName = `${input.current.manufacturer} ${input.current.model}`;

  return (
    <div className="space-y-8">
      <ValidationAlerts messages={validationMessages} />
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Executive Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Investment decision intelligence · {currentName} vs {selected?.name ?? ""}
              {kpis.fleetVehicleCount > 1 && (
                <span className="ml-2 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                  Fleet ×{kpis.fleetVehicleCount}
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={async () => {
                try {
                  await downloadExecutiveSummary(input, result, caseName);
                  showToast("Executive summary downloaded", "success");
                } catch {
                  showToast("Could not generate PDF", "error");
                }
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Executive summary
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadBoardPack(input, result)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Board Pack
            </Button>
            <RecommendationSummaryCopyButton />
          </div>
        </div>
        <InfographicPromptPanel className="mt-4" />
      </div>

      <DashboardHeroStrip
        monthlySaving={kpis.monthlySaving}
        amountFinanced={tradeIn.amountFinanced}
        investmentScore={decision.investmentScore.total}
        rating={decision.investmentScore.rating}
        trafficLight={decision.trafficLight.status}
      />

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

      <MonthlyRepaymentComparisonCard />

      <CurrentMonthlyBreakdownCard />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 max-sm:flex max-sm:gap-4 max-sm:overflow-x-auto max-sm:pb-2 max-sm:snap-x max-sm:snap-mandatory">
        <KpiCard
          title="Current Repayment"
          value={formatCurrency(kpis.currentFinanceInstalment)}
          numericValue={kpis.currentFinanceInstalment}
          formatValue={(n) => formatCurrency(n)}
          subtitle="your loan payment / month"
          className="max-sm:min-w-[240px] max-sm:snap-center"
        />
        <KpiCard
          title="Replacement Repayment"
          value={formatCurrency(kpis.replacementFinanceInstalment)}
          numericValue={kpis.replacementFinanceInstalment}
          formatValue={(n) => formatCurrency(n)}
          subtitle="new vehicle loan / month"
          className="max-sm:min-w-[240px] max-sm:snap-center"
        />
        <KpiCard
          title="Monthly Saving"
          value={formatCurrency(kpis.monthlySaving)}
          numericValue={kpis.monthlySaving}
          formatValue={(n) => formatCurrency(n)}
          positiveIsGood
          className="max-sm:min-w-[240px] max-sm:snap-center"
        />
        <KpiCard
          title="Annual Saving"
          value={formatCurrency(kpis.annualSaving)}
          numericValue={kpis.annualSaving}
          formatValue={(n) => formatCurrency(n)}
          positiveIsGood
          className="max-sm:min-w-[240px] max-sm:snap-center"
        />
        <KpiCard
          title="10-Year Saving"
          value={formatCurrency(kpis.tenYearSaving)}
          numericValue={kpis.tenYearSaving}
          formatValue={(n) => formatCurrency(n)}
          positiveIsGood
        />
        <KpiCard
          title="Finance Required"
          value={formatCurrency(tradeIn.amountFinanced)}
          numericValue={tradeIn.amountFinanced}
          formatValue={(n) => formatCurrency(n)}
        />
        <KpiCard
          title="Trade Equity"
          value={formatCurrency(tradeIn.tradeEquity)}
          numericValue={tradeIn.tradeEquity}
          formatValue={(n) => formatCurrency(n)}
        />
        <KpiCard title="Solar Contribution" value={`${solar.solarContributionPercent.toFixed(0)}%`} subtitle="of charging" />
        <KpiCard title="Fuel Saving" value={formatCurrency(kpis.fuelSaving)} subtitle="annual" positiveIsGood />
        <KpiCard title="Break-even Point" value={kpis.paybackMonths > 0 ? `${kpis.paybackMonths} months` : "N/A"} />
        <KpiCard title="Net Cost per km" value={`R${kpis.costPerKmReplacement.toFixed(2)}`} subtitle="replacement" />
        <KpiCard title="Warranty Remaining" value={`${kpis.batteryWarrantyRemainingYears} years`} subtitle="battery" />
        <KpiCard title="Estimated Resale" value={formatCurrency(selected?.expectedResale ?? 0)} />
        <KpiCard
          title="Current Vehicle Cost"
          value={formatCurrency(currentMonthlyFromInputs.totalMonthly)}
          numericValue={currentMonthlyFromInputs.totalMonthly}
          formatValue={(n) => formatCurrency(n)}
          subtitle="per month · from your inputs"
        />
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
