"use client";

import { useCaseStore } from "@/store/case-store";
import { getDataEntryProgress } from "@/lib/wizard-validation";
import { isStepComplete } from "@/lib/wizard-validation";
import { getNextIncompleteStep } from "@/lib/workflow-guidance";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export function WizardProgress() {
  const input = useCaseStore((s) => s.input);
  const activeStep = useCaseStore((s) => s.activeStep);
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const { completed, total, steps } = getDataEntryProgress(input, workflowMode);
  const nextIncomplete = getNextIncompleteStep(workflowMode, input);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Setup progress</p>
        <p className="text-xs text-muted-foreground">
          {completed} of {total} steps complete
        </p>
      </div>
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={false}
          animate={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {steps.map((step) => {
          const done = isStepComplete(step, input);
          const active = activeStep === step;
          const isNext = step === nextIncomplete;
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
                isNext && !active && "ring-1 ring-primary/30 bg-primary/5 font-medium text-foreground",
                done && !active && !isNext && "text-success",
                !done && !active && !isNext && "text-muted-foreground"
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
