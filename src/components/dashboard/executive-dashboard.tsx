"use client";

import { useCaseStore } from "@/store/case-store";
import { KpiCard } from "@/components/kpi/kpi-card";
import { formatCurrency } from "@/lib/format";
import { RecommendationCard } from "./recommendation-card";

export function ExecutiveDashboard() {
  const kpis = useCaseStore((s) => s.result.kpis);
  const currentName = useCaseStore((s) => `${s.input.current.manufacturer} ${s.input.current.model}`);
  const selectedName = useCaseStore((s) =>
    s.input.replacements.find((v) => v.id === s.input.selectedReplacementId)?.name ?? ""
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Executive Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Comparing {currentName} vs {selectedName}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 max-sm:flex max-sm:gap-4 max-sm:overflow-x-auto max-sm:pb-2 max-sm:snap-x max-sm:snap-mandatory">
        <KpiCard title="Current Vehicle Cost" value={formatCurrency(kpis.currentMonthlyCost)} subtitle="per month" className="max-sm:min-w-[240px] max-sm:snap-center" />
        <KpiCard title="Replacement Cost" value={formatCurrency(kpis.replacementMonthlyCost)} subtitle="per month" className="max-sm:min-w-[240px] max-sm:snap-center" />
        <KpiCard
          title="Monthly Saving"
          value={formatCurrency(Math.abs(kpis.monthlySaving))}
          subtitle={kpis.monthlySaving >= 0 ? "saving" : "additional cost"}
          delta={kpis.monthlySaving}
          deltaLabel={formatCurrency(kpis.monthlySaving)}
          positiveIsGood
        />
        <KpiCard title="Annual Saving" value={formatCurrency(kpis.annualSaving)} positiveIsGood />
        <KpiCard title="10-Year Saving" value={formatCurrency(kpis.tenYearSaving)} positiveIsGood />
        <KpiCard title="Finance Balance" value={formatCurrency(kpis.financeBalance)} subtitle="end of term" />
        <KpiCard title="Solar Saving" value={formatCurrency(kpis.solarSaving)} subtitle="annual" positiveIsGood />
        <KpiCard title="Fuel Saving" value={formatCurrency(kpis.fuelSaving)} subtitle="annual" positiveIsGood />
        <KpiCard title="Cost per km (Current)" value={`R${kpis.costPerKmCurrent.toFixed(2)}`} />
        <KpiCard title="Cost per km (New)" value={`R${kpis.costPerKmReplacement.toFixed(2)}`} />
        <KpiCard title="Return on Investment" value={`${kpis.roi.toFixed(1)}%`} positiveIsGood />
        <KpiCard
          title="Payback Period"
          value={kpis.paybackMonths > 0 ? `${kpis.paybackMonths} months` : "N/A"}
        />
        <KpiCard
          title="Battery Warranty"
          value={`${kpis.batteryWarrantyRemainingYears} years`}
          subtitle="remaining"
        />
      </div>

      <RecommendationCard />
    </div>
  );
}
