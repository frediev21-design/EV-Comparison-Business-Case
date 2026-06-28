"use client";

import { useMemo } from "react";
import { useCaseStore } from "@/store/case-store";
import {
  copyRecommendationSummary,
  generateRecommendationSummary,
  isRecommendationSummaryReady,
} from "@/lib/recommendation-summary";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { Copy } from "lucide-react";

export function RecommendationSummaryCopyButton() {
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
    <Button variant="outline" size="sm" onClick={() => void handleCopy()}>
      <Copy className="mr-2 h-4 w-4" />
      Copy summary
    </Button>
  );
}
