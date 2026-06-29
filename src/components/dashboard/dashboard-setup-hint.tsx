"use client";

import { useCaseStore } from "@/store/case-store";
import { getNextIncompleteStep, isSetupComplete, nextStepPromptLabel } from "@/lib/workflow-guidance";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function DashboardSetupHint() {
  const input = useCaseStore((s) => s.input);
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);

  const nextStep = getNextIncompleteStep(workflowMode, input);
  if (isSetupComplete(workflowMode, input) || !nextStep) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Complete{" "}
        <span className="font-medium text-foreground">{nextStepPromptLabel(nextStep)}</span>
        {" "}to unlock the full investment score and savings breakdown.
      </p>
      <Button size="sm" variant="outline" onClick={() => setActiveStep(nextStep)}>
        Continue setup
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}
