"use client";

import { useCaseStore } from "@/store/case-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RiskFlag } from "@/engine/types";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function RiskCard({ flag }: { flag: RiskFlag }) {
  const icons = {
    low: AlertCircle,
    medium: AlertTriangle,
    high: AlertTriangle,
    positive: CheckCircle,
  };
  const Icon = icons[flag.level];

  const badgeVariant =
    flag.level === "positive"
      ? "success"
      : flag.level === "high"
        ? "destructive"
        : flag.level === "medium"
          ? "warning"
          : "outline";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{flag.label}</CardTitle>
        <Badge variant={badgeVariant}>{flag.level}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Icon
            className={cn(
              "h-5 w-5 shrink-0",
              flag.level === "positive" && "text-success",
              flag.level === "high" && "text-destructive",
              flag.level === "medium" && "text-warning",
              flag.level === "low" && "text-muted-foreground"
            )}
          />
          <p className="text-sm text-muted-foreground">{flag.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function RiskStep() {
  const risk = useCaseStore((s) => s.result.risk);
  const selectedId = useCaseStore((s) => s.input.selectedReplacementId);
  const selectedName = useCaseStore((s) =>
    s.input.replacements.find((v) => v.id === selectedId)?.name ?? "Replacement"
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Risk Analysis</h2>
        <p className="text-sm text-muted-foreground">Rule-based risk assessment for current and replacement vehicles.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="font-medium">Current Vehicle</h3>
          <div className="grid gap-3">
            {risk.current.map((flag) => (
              <RiskCard key={flag.id} flag={flag} />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="font-medium">{selectedName}</h3>
          <div className="grid gap-3">
            {(risk.replacements[selectedId] ?? []).map((flag) => (
              <RiskCard key={flag.id} flag={flag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
