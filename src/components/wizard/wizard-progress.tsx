"use client";

import { useCaseStore } from "@/store/case-store";
import { getDataEntryProgress } from "@/lib/wizard-validation";
import { isStepComplete } from "@/lib/wizard-validation";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function WizardProgress() {
  const input = useCaseStore((s) => s.input);
  const activeStep = useCaseStore((s) => s.activeStep);
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const { completed, total, steps } = getDataEntryProgress(input, workflowMode);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Setup progress</p>
        <p className="text-xs text-muted-foreground">
          {completed} of {total} steps complete
        </p>
      </div>
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {steps.map((step) => {
          const done = isStepComplete(step, input);
          const active = activeStep === step;
          const labels: Record<string, string> = {
            current: "Current",
            replacement: "New",
            "trade-in": "Trade-In",
            finance: "Finance",
            "running-costs": "Running",
            solar: "Solar",
            ownership: "Ownership",
            risk: "Risk",
          };
          return (
            <span
              key={step}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs",
                active && "bg-accent/15 font-medium text-accent",
                done && !active && "text-success",
                !done && !active && "text-muted-foreground"
              )}
            >
              {done && <Check className="h-3 w-3" />}
              {labels[step] ?? step}
            </span>
          );
        })}
      </div>
    </div>
  );
}
