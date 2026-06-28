"use client";

import { useMemo } from "react";
import { useCaseStore } from "@/store/case-store";
import {
  copyRecommendationSummary,
  generateRecommendationSummary,
  isRecommendationSummaryReady,
} from "@/lib/recommendation-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { Copy, CheckCircle2 } from "lucide-react";

export function RecommendationSummaryPanel() {
  const input = useCaseStore((s) => s.input);
  const result = useCaseStore((s) => s.result);
  const ready = isRecommendationSummaryReady(input);

  const summary = useMemo(
    () => generateRecommendationSummary(input, result),
    [input, result]
  );

  const handleCopy = async () => {
    try {
      await copyRecommendationSummary(summary);
      showToast("Recommendation summary copied", "success");
    } catch {
      showToast("Could not copy to clipboard", "error");
    }
  };

  if (!ready) return null;

  return (
    <Card className="border-success/25 bg-success/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <CheckCircle2 className="h-5 w-5 text-success" />
          Recommendation summary
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Copy this block to share with your customer, paste into an email, or include in a proposal.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <pre className="overflow-x-auto rounded-md border border-border bg-background/80 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {summary}
        </pre>
        <Button size="sm" variant="outline" onClick={() => void handleCopy()}>
          <Copy className="mr-2 h-4 w-4" />
          Copy summary
        </Button>
      </CardContent>
    </Card>
  );
}
