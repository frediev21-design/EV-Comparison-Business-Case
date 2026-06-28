"use client";

import { useCaseStore } from "@/store/case-store";
import { formatCurrency, formatDelta } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SavingsBreakdownCard() {
  const kpis = useCaseStore((s) => s.result.kpis);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Monthly Saving Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Operating (fuel, maintenance)</p>
          <p className="text-lg font-bold tabular-nums text-success">
            {formatDelta(kpis.operatingMonthlySaving)}
          </p>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Finance payment change</p>
          <p
            className={`text-lg font-bold tabular-nums ${
              kpis.financeMonthlyDelta >= 0 ? "text-success" : "text-destructive"
            }`}
          >
            {formatDelta(kpis.financeMonthlyDelta)}
          </p>
        </div>
        <div className="rounded-lg bg-accent/10 p-3">
          <p className="text-xs text-muted-foreground">Net monthly saving</p>
          <p className="text-lg font-bold tabular-nums text-accent">
            {formatCurrency(kpis.monthlySaving)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
