"use client";

import { useCaseStore } from "@/store/case-store";
import { buildCurrentMonthlyFromInputs } from "@/lib/current-monthly-breakdown";
import { formatCurrency, formatDelta } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthlyRepaymentComparisonCardProps {
  className?: string;
  compact?: boolean;
}

export function MonthlyRepaymentComparisonCard({
  className,
  compact = false,
}: MonthlyRepaymentComparisonCardProps) {
  const input = useCaseStore((s) => s.input);
  const kpis = useCaseStore((s) => s.result.kpis);
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
  const breakdown = buildCurrentMonthlyFromInputs(input);
  const fleetCount = kpis.fleetVehicleCount;
  const fleetLabel = fleetCount > 1 ? `Fleet total (×${fleetCount})` : undefined;
  const financeDelta = kpis.financeMonthlyDelta;

  return (
    <Card className={className}>
      <CardHeader className={compact ? "pb-2" : undefined}>
        <CardTitle className={compact ? "text-sm" : "text-base"}>Monthly loan repayments</CardTitle>
        <p className="text-xs text-muted-foreground">
          Finance payment only — what you repay on the vehicle loan each month, excluding fuel,
          insurance, and maintenance.
          {fleetLabel && ` ${fleetLabel}.`}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current repayment
            </p>
            <p className={cn("mt-1 font-bold tabular-nums tracking-tight", compact ? "text-2xl" : "text-3xl")}>
              {formatCurrency(kpis.currentFinanceInstalment)}
              <span className="text-base font-normal text-muted-foreground">/mo</span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              You entered {formatCurrency(breakdown.enteredInstalment)}/mo
              {breakdown.instalmentAdjusted && (
                <span className="text-warning">
                  {" "}
                  · adjusted to {formatCurrency(breakdown.instalment)}/mo (loan only)
                </span>
              )}
            </p>
            {input.current.outstandingFinance > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Outstanding finance: {formatCurrency(input.current.outstandingFinance)}
              </p>
            )}
          </div>

          <div className="hidden justify-center sm:flex">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="rounded-xl border border-accent/25 bg-accent/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Replacement repayment
            </p>
            <p className={cn("mt-1 font-bold tabular-nums tracking-tight text-accent", compact ? "text-2xl" : "text-3xl")}>
              {formatCurrency(kpis.replacementFinanceInstalment)}
              <span className="text-base font-normal text-muted-foreground">/mo</span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {selected?.name ?? "Replacement"} · {selected?.financeTermMonths ?? 0} months @{" "}
              {selected?.interestRate ?? 0}%
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/40 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Repayment change</span>
          <span
            className={cn(
              "font-semibold tabular-nums",
              financeDelta >= 0 ? "text-success" : "text-destructive"
            )}
          >
            {formatDelta(financeDelta)}/mo
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {financeDelta >= 0 ? "lower replacement payment" : "higher replacement payment"}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
