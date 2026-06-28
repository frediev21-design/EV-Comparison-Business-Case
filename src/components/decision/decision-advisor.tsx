"use client";

import type { AdvisorTip } from "@/engine/decision/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export function DecisionAdvisor({ tips }: { tips: AdvisorTip[] }) {
  return (
    <Card className="border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="h-5 w-5 text-warning" />
          AI Decision Advisor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tips.map((tip) => (
          <div
            key={tip.id}
            className={cn(
              "rounded-lg border px-4 py-3 text-sm leading-relaxed",
              tip.priority === "high" && "border-accent/30 bg-accent/5",
              tip.priority === "medium" && "border-border bg-muted/30",
              tip.priority === "low" && "border-border bg-background"
            )}
          >
            {tip.message}
          </div>
        ))}
        {tips.length === 0 && (
          <p className="text-sm text-muted-foreground">No additional advisory insights at this time.</p>
        )}
      </CardContent>
    </Card>
  );
}
