"use client";

import { useCaseStore } from "@/store/case-store";
import { getCaseValidationMessages } from "@/lib/wizard-validation";
import { ValidationAlerts } from "@/components/wizard/validation-alerts";
import { KpiCard } from "@/components/kpi/kpi-card";
import { formatCurrency } from "@/lib/format";
import { buildVehicleComparisonLabel } from "@/lib/case-labels";
import { ExecutiveDashboardHero } from "./executive-dashboard-hero";
import { DashboardKpiStrip } from "./dashboard-kpi-strip";
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
import { BoardSummaryPanel } from "@/components/decision/board-summary-panel";
import { RiskMatrixDashboard } from "@/components/decision/risk-matrix-dashboard";
import { SwotPanel } from "@/components/decision/swot-panel";
import { DecisionTimeline } from "@/components/decision/decision-timeline";
import { DecisionAdvisor } from "@/components/decision/decision-advisor";
import { NPV_KPI_HELP, NPV_KPI_TITLE, npvKpiSubtitle } from "@/lib/npv-explainer";
import { InfographicPromptPanel } from "./infographic-prompt-panel";
import { RecommendationSummaryCopyButton } from "./recommendation-summary-panel";
import { ReplacementComparisonTable } from "./replacement-comparison-table";
import { DashboardSetupHint } from "./dashboard-setup-hint";
import { QuickModeDefaultsBanner } from "./quick-mode-defaults-banner";
import { ShowroomUpgradeBanner } from "./showroom-upgrade-banner";
import { ModelDisclaimer } from "./model-disclaimer";

export function ExecutiveDashboard() {
  const input = useCaseStore((s) => s.input);
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const kpis = useCaseStore((s) => s.result.kpis);
  const result = useCaseStore((s) => s.result);
  const caseName = useCaseStore((s) => s.caseName);
  const decision = result.decision;
  const tradeIn = result.tradeIn;
  const solar = result.solar;
  const validationMessages = getCaseValidationMessages(input, result);
  const currentMonthlyFromInputs = buildCurrentMonthlyFromInputs(input);
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
  const comparisonLabel = buildVehicleComparisonLabel(input).replace(" → ", " vs ");
  const isShowroom = workflowMode === "showroom";

  return (
    <div className="space-y-8">
      <ValidationAlerts messages={validationMessages} />
      <DashboardSetupHint />
      <ShowroomUpgradeBanner />
      <QuickModeDefaultsBanner />
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Executive Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Total Cost of Ownership — {comparisonLabel}
              {kpis.fleetVehicleCount > 1 && (
                <span className="ml-2 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                  Fleet ×{kpis.fleetVehicleCount}
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Live
            </span>
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
              Export Report
            </Button>
            {!isShowroom && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadBoardPack(input, result)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Board Pack
              </Button>
            )}
            {!isShowroom && <RecommendationSummaryCopyButton />}
          </div>
        </div>
        {!isShowroom && <InfographicPromptPanel className="mt-4" />}
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

      <ModelDisclaimer className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3" />

      <ReplacementComparisonTable />

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
          title="Indicative Monthly Cash Flow"
          value={formatCurrency(kpis.monthlySaving)}
          numericValue={kpis.monthlySaving}
          formatValue={(n) => formatCurrency(n)}
          subtitle="10-yr avg incl. post-loan finance"
          positiveIsGood
          className="max-sm:min-w-[240px] max-sm:snap-center"
        />
        <KpiCard
          title="10-Year Net TCO Delta"
          value={formatCurrency(kpis.tenYearSaving)}
          numericValue={kpis.tenYearSaving}
          formatValue={(n) => formatCurrency(n)}
          subtitle="incl. finance, running & resale"
          positiveIsGood
        />
        {!isShowroom && (
          <>
            <KpiCard
              title="Annual Cash Flow Delta"
              value={formatCurrency(kpis.annualSaving)}
              numericValue={kpis.annualSaving}
              formatValue={(n) => formatCurrency(n)}
              subtitle="monthly × 12 · not TCO"
              positiveIsGood
              className="max-sm:min-w-[240px] max-sm:snap-center"
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
            <KpiCard
              title={NPV_KPI_TITLE}
              value={formatCurrency(kpis.npv10Year)}
              numericValue={kpis.npv10Year}
              formatValue={(n) => formatCurrency(n)}
              subtitle={npvKpiSubtitle(input.assumptions.discountRate ?? 10.5)}
              helpText={NPV_KPI_HELP}
              positiveIsGood
            />
            <KpiCard title="Indicative Payback" value={kpis.paybackMonths > 0 ? `${kpis.paybackMonths} months` : "N/A"} subtitle="on net finance vs monthly delta" />
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
          </>
        )}
      </div>

      {!isShowroom && (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            <BoardSummaryPanel summary={decision.boardSummary} />
            <DecisionAdvisor tips={decision.advisorTips} />
          </div>

          <RecommendationCard />

          <SwotPanel swot={decision.swot} />
          <RiskMatrixDashboard items={decision.riskMatrix} />
          <DecisionTimeline events={decision.timeline} />
        </>
      )}

      {isShowroom && <RecommendationCard />}
    </div>
  );
}
