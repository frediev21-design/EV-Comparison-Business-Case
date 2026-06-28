"use client";

import { useCaseStore } from "@/store/case-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote } from "lucide-react";

export function RecommendationCard() {
  const recommendation = useCaseStore((s) => s.result.decision?.executiveRecommendation ?? s.result.recommendation);

  return (
    <Card className="border-accent/20 bg-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Quote className="h-5 w-5 text-accent" />
          Executive Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground/90">{recommendation}</p>
        <p className="mt-4 text-xs text-muted-foreground">
          Generated automatically from entered assumptions. Adjust inputs in the wizard or what-if panel to refine this recommendation.
        </p>
      </CardContent>
    </Card>
  );
}
