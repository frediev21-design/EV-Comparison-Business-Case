"use client";

import { useCaseStore } from "@/store/case-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { RunningCostBreakdown } from "@/engine/types";

function CostTable({ title, costs }: { title: string; costs: RunningCostBreakdown }) {
  const rows = [
    { label: "Fuel", value: costs.fuel },
    { label: "Electricity", value: costs.electricity },
    { label: "Maintenance", value: costs.maintenance },
    { label: "Insurance", value: costs.insurance },
    { label: "Tyres", value: costs.tyres },
    { label: "Licence", value: costs.licence },
    { label: "Repairs", value: costs.repairs },
  ].filter((r) => r.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <tbody>
            {rows.map(({ label, value }) => (
              <tr key={label} className="border-b border-border/50">
                <td className="py-2 text-muted-foreground">{label}</td>
                <td className="py-2 text-right font-medium tabular-nums">{formatCurrency(value)}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className="pt-3">Total Annual</td>
              <td className="pt-3 text-right tabular-nums text-accent">{formatCurrency(costs.total)}</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export function RunningCostsStep() {
  const running = useCaseStore((s) => s.result.running);
  const selectedId = useCaseStore((s) => s.input.selectedReplacementId);
  const selectedName = useCaseStore((s) =>
    s.input.replacements.find((v) => v.id === selectedId)?.name ?? "Replacement"
  );
  const selectedRunning = running.replacements[selectedId];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Running Costs</h2>
        <p className="text-sm text-muted-foreground">Annual operating cost comparison.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <CostTable title="Current Vehicle" costs={running.current} />
        {selectedRunning && <CostTable title={selectedName} costs={selectedRunning} />}
      </div>
    </div>
  );
}
