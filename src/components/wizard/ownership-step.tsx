"use client";

import { useCaseStore } from "@/store/case-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/format";
import type { OwnershipHorizon } from "@/engine/types";

function HorizonTable({ horizons }: { horizons: OwnershipHorizon[] }) {
  const metrics = [
    { key: "monthlyCost" as const, label: "Monthly Cost" },
    { key: "annualCost" as const, label: "Annual Cost" },
    { key: "totalCost" as const, label: "Total Cost" },
    { key: "costPerKm" as const, label: "Cost per km" },
    { key: "costPerDay" as const, label: "Cost per day" },
    { key: "netOwnershipCost" as const, label: "Net Ownership Cost" },
    { key: "ownershipAfterResale" as const, label: "After Resale" },
  ];

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-left text-muted-foreground">
          <th className="pb-2">Metric</th>
          {horizons.map((h) => (
            <th key={h.years} className="pb-2 text-right">{h.years} Years</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {metrics.map(({ key, label }) => (
          <tr key={key} className="border-b border-border/50">
            <td className="py-2 text-muted-foreground">{label}</td>
            {horizons.map((h) => (
              <td key={h.years} className="py-2 text-right tabular-nums font-medium">
                {key.includes("costPerKm")
                  ? `R${h[key].toFixed(2)}`
                  : formatCurrency(h[key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function OwnershipStep() {
  const ownership = useCaseStore((s) => s.result.ownership);
  const selectedId = useCaseStore((s) => s.input.selectedReplacementId);
  const selectedName = useCaseStore((s) =>
    s.input.replacements.find((v) => v.id === selectedId)?.name ?? "Replacement"
  );
  const horizon = useCaseStore((s) => s.ownershipHorizon);
  const setHorizon = useCaseStore((s) => s.setOwnershipHorizon);
  const selectedHorizons = ownership.replacements[selectedId] ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Ownership Cost</h2>
        <p className="text-sm text-muted-foreground">Total cost of ownership across multiple horizons.</p>
      </div>

      <Tabs value={String(horizon)} onValueChange={(v) => setHorizon(Number(v) as 5 | 7 | 10)}>
        <TabsList>
          <TabsTrigger value="5">5 Years</TabsTrigger>
          <TabsTrigger value="7">7 Years</TabsTrigger>
          <TabsTrigger value="10">10 Years</TabsTrigger>
        </TabsList>
        {[5, 7, 10].map((years) => {
          const current = ownership.current.find((h) => h.years === years);
          const replacement = selectedHorizons.find((h) => h.years === years);
          return (
            <TabsContent key={years} value={String(years)}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Current Monthly", value: current?.monthlyCost ?? 0 },
                  { label: "Replacement Monthly", value: replacement?.monthlyCost ?? 0 },
                  { label: "Current Total", value: current?.totalCost ?? 0 },
                  { label: "Replacement Total", value: replacement?.totalCost ?? 0 },
                ].map(({ label, value }) => (
                  <Card key={label}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs text-muted-foreground">{label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold tabular-nums">{formatCurrency(value)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Current Vehicle</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <HorizonTable horizons={ownership.current} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">{selectedName}</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <HorizonTable horizons={selectedHorizons} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
