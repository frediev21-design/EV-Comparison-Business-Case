"use client";

import type { RiskMatrixItem } from "@/engine/decision/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LEVEL_STYLES = {
  green: "border-success/30 bg-success/5 text-success",
  amber: "border-warning/30 bg-warning/5 text-warning",
  red: "border-destructive/30 bg-destructive/5 text-destructive",
};

function RiskCell({ item }: { item: RiskMatrixItem }) {
  return (
    <div className={cn("rounded-lg border p-3", LEVEL_STYLES[item.level])}>
      <p className="text-sm font-medium">{item.label}</p>
      <p className="mt-1 text-xs opacity-80">{item.description}</p>
    </div>
  );
}

export function RiskMatrixDashboard({ items }: { items: RiskMatrixItem[] }) {
  const current = items.filter((i) => i.category === "current");
  const replacement = items.filter((i) => i.category === "replacement");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Vehicle — Risk Matrix</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {current.map((item) => (
            <RiskCell key={item.id} item={item} />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Replacement Vehicle — Risk Matrix</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {replacement.map((item) => (
            <RiskCell key={item.id} item={item} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
