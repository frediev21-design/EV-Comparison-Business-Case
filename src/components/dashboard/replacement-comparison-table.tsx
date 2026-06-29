"use client";

import { useMemo } from "react";
import { useCaseStore } from "@/store/case-store";
import { computeReplacementComparison } from "@/lib/replacement-comparison";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReplacementComparisonTable() {
  const input = useCaseStore((s) => s.input);
  const selectReplacement = useCaseStore((s) => s.selectReplacement);

  const rows = useMemo(() => computeReplacementComparison(input), [input]);

  if (rows.length < 2) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Replacement Comparison</CardTitle>
        <p className="text-sm text-muted-foreground">
          Compare finance and savings across replacement options in this case.
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2 pr-4 font-medium">Vehicle</th>
              <th className="pb-2 pr-4 font-medium">Price</th>
              <th className="pb-2 pr-4 font-medium">Monthly saving</th>
              <th className="pb-2 pr-4 font-medium">Instalment</th>
              <th className="pb-2 pr-4 font-medium">Finance</th>
              <th className="pb-2 pr-4 font-medium">Score</th>
              <th className="pb-2 pr-4 font-medium">Payback</th>
              <th className="pb-2 font-medium">10-yr TCO delta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-border/50",
                  row.isSelected && "bg-accent/5"
                )}
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{row.name}</span>
                    {row.isSelected ? (
                      <span className="text-xs text-accent">Selected</span>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => selectReplacement(row.id)}
                      >
                        Select
                      </Button>
                    )}
                  </div>
                </td>
                <td className="py-3 pr-4 tabular-nums">{formatCurrency(row.price)}</td>
                <td
                  className={cn(
                    "py-3 pr-4 tabular-nums",
                    row.monthlySaving >= 0 ? "text-success" : "text-destructive"
                  )}
                >
                  {formatCurrency(row.monthlySaving)}
                </td>
                <td className="py-3 pr-4 tabular-nums">{formatCurrency(row.monthlyInstalment)}</td>
                <td className="py-3 pr-4 tabular-nums">{formatCurrency(row.financeRequired)}</td>
                <td className="py-3 pr-4 tabular-nums font-medium">{row.investmentScore}/100</td>
                <td className="py-3 pr-4 tabular-nums">
                  {row.paybackMonths > 0 ? `${row.paybackMonths} mo` : "N/A"}
                </td>
                <td className="py-3 tabular-nums">{formatCurrency(row.tenYearSaving)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
