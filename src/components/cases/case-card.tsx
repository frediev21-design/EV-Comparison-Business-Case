"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { ScenarioRecord } from "@/engine/types";
import { previewScenario, getResumeStep } from "@/lib/scenario-preview";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SCORE_RING: Record<string, string> = {
  go: "border-success/40 bg-success/5",
  review: "border-warning/40 bg-warning/5",
  stop: "border-destructive/40 bg-destructive/5",
};

const SCORE_DOT: Record<string, string> = {
  go: "bg-success",
  review: "bg-warning",
  stop: "bg-destructive",
};

interface CaseCardProps {
  scenario: ScenarioRecord;
  onDelete: (id: string, name: string) => void;
}

export function CaseCard({ scenario, onDelete }: CaseCardProps) {
  const preview = previewScenario(scenario.snapshot);
  const resumeStep = getResumeStep(scenario.snapshot);
  const href = `/case/${scenario.id}?step=${resumeStep}`;
  const updatedAgo = formatDistanceToNow(new Date(scenario.updatedAt), { addSuffix: true });

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{scenario.name}</CardTitle>
          <div
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1",
              SCORE_RING[preview.trafficLight]
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", SCORE_DOT[preview.trafficLight])} />
            <span className="text-xs font-semibold tabular-nums">{preview.investmentScore}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{preview.vehicleComparison}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Monthly saving</p>
            <p
              className={cn(
                "font-semibold tabular-nums",
                preview.monthlySaving >= 0 ? "text-success" : "text-destructive"
              )}
            >
              {formatCurrency(preview.monthlySaving)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Decision</p>
            <p className="font-medium">{preview.trafficLightLabel}</p>
          </div>
        </div>

        {scenario.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {scenario.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">Updated {updatedAgo}</p>

        <div className="mt-auto flex gap-2">
          <Button asChild className="flex-1">
            <Link href={href}>
              Resume
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete ${scenario.name}`}
            onClick={() => onDelete(scenario.id, scenario.name)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
