"use client";

import { useEffect, useState, useCallback } from "react";
import { scenarioRepository } from "@/lib/db";
import { runFullBusinessCase } from "@/engine";
import type { BusinessCaseInput } from "@/engine/types";
import { useCaseStore } from "@/store/case-store";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ScenarioRow {
  id: string;
  name: string;
  monthlySaving: number;
  financeRequired: number;
  paybackMonths: number;
  tenYearSaving: number;
  isCurrent: boolean;
}

function computeRow(
  id: string,
  name: string,
  snapshot: BusinessCaseInput,
  isCurrent: boolean
): ScenarioRow {
  const result = runFullBusinessCase(snapshot);
  return {
    id,
    name,
    monthlySaving: result.kpis.monthlySaving,
    financeRequired: result.tradeIn.amountFinanced,
    paybackMonths: result.kpis.paybackMonths,
    tenYearSaving: result.kpis.tenYearSaving,
    isCurrent,
  };
}

export function ScenarioComparisonTable() {
  const caseId = useCaseStore((s) => s.caseId);
  const input = useCaseStore((s) => s.input);
  const caseName = useCaseStore((s) => s.caseName);
  const [rows, setRows] = useState<ScenarioRow[]>([]);

  const refresh = useCallback(async () => {
    const saved = await scenarioRepository.list();
    const tableRows: ScenarioRow[] = saved.map((record) =>
      computeRow(
        record.id,
        record.name,
        record.id === caseId ? input : record.snapshot,
        record.id === caseId
      )
    );

    if (!caseId) {
      tableRows.unshift(
        computeRow("__live__", `${caseName} (unsaved)`, input, true)
      );
    }

    setRows(tableRows);
  }, [caseId, input, caseName]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (rows.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Scenario Comparison</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-2 pr-4 font-medium">Scenario</th>
              <th className="pb-2 pr-4 font-medium">Monthly Saving</th>
              <th className="pb-2 pr-4 font-medium">Finance Required</th>
              <th className="pb-2 pr-4 font-medium">Payback</th>
              <th className="pb-2 font-medium">10-Year Saving</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  "border-b border-border/50",
                  row.isCurrent && "bg-accent/5 font-medium"
                )}
              >
                <td className="py-3 pr-4">
                  {row.name}
                  {row.isCurrent && (
                    <span className="ml-2 text-xs text-accent">(current)</span>
                  )}
                </td>
                <td
                  className={cn(
                    "py-3 pr-4 tabular-nums",
                    row.monthlySaving >= 0 ? "text-success" : "text-destructive"
                  )}
                >
                  {formatCurrency(row.monthlySaving)}
                </td>
                <td className="py-3 pr-4 tabular-nums">{formatCurrency(row.financeRequired)}</td>
                <td className="py-3 pr-4 tabular-nums">
                  {row.paybackMonths > 0 ? `${row.paybackMonths} mo` : "N/A"}
                </td>
                <td className="py-3 tabular-nums">{formatCurrency(row.tenYearSaving)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length < 2 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Save at least two scenarios to compare side-by-side.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
