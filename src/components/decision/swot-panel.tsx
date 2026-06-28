"use client";

import type { SwotAnalysis } from "@/engine/decision/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function SwotQuadrant({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: "strength" | "weakness" | "opportunity" | "threat";
}) {
  const colors = {
    strength: "border-success/30 bg-success/5",
    weakness: "border-destructive/30 bg-destructive/5",
    opportunity: "border-accent/30 bg-accent/5",
    threat: "border-warning/30 bg-warning/5",
  };

  return (
    <Card className={colors[variant]}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-muted-foreground">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function SwotPanel({ swot }: { swot: SwotAnalysis }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SwotQuadrant title="Strengths" items={swot.strengths} variant="strength" />
      <SwotQuadrant title="Weaknesses" items={swot.weaknesses} variant="weakness" />
      <SwotQuadrant title="Opportunities" items={swot.opportunities} variant="opportunity" />
      <SwotQuadrant title="Threats" items={swot.threats} variant="threat" />
    </div>
  );
}
