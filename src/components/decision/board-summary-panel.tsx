"use client";

import type { BoardSummary } from "@/engine/decision/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

export function BoardSummaryPanel({ summary }: { summary: BoardSummary }) {
  const rows = [
    { label: "Current Situation", value: summary.currentSituation, format: false },
    { label: "Proposed Investment", value: summary.proposedInvestment, format: false },
    { label: "Capital Required", value: summary.capitalRequired, format: true },
    { label: "Amount Financed", value: summary.amountFinanced, format: true },
    { label: "Monthly Cash Flow", value: summary.monthlyCashFlow, format: true },
    { label: "Fuel Savings (annual)", value: summary.fuelSavings, format: true },
    { label: "Maintenance Savings (annual)", value: summary.maintenanceSavings, format: true },
    { label: "Solar Savings (annual)", value: summary.solarSavings, format: true },
    { label: "10-Year Ownership Cost", value: summary.tenYearOwnershipCost, format: true },
    { label: "10-Year Net TCO Delta", value: summary.tenYearSavings, format: true },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Board Level Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-border">
          {rows.map(({ label, value, format }) => (
            <div key={label} className="flex justify-between gap-4 py-3 text-sm">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium tabular-nums text-right">
                {format ? formatCurrency(value as number) : String(value)}
              </dd>
            </div>
          ))}
          <div className="pt-4">
            <dt className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Overall Recommendation
            </dt>
            <dd className="text-sm leading-relaxed">{summary.overallRecommendation}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
