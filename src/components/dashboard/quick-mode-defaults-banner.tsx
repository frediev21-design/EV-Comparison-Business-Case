"use client";

import { useCaseStore } from "@/store/case-store";
import { Button } from "@/components/ui/button";
import { Info, List } from "lucide-react";

export function QuickModeDefaultsBanner() {
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);
  const setWorkflowMode = useCaseStore((s) => s.setWorkflowMode);

  if (workflowMode !== "quick") return null;

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
      <div className="flex gap-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="text-sm">
          <p className="font-medium">Quick mode — using defaults for skipped steps</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Finance terms, running costs, solar, ownership, and risk use preset assumptions. Switch
            to Full mode to review and adjust every step.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setWorkflowMode("full");
          setActiveStep("finance");
        }}
      >
        <List className="mr-2 h-4 w-4" />
        Open full setup
      </Button>
    </div>
  );
}
