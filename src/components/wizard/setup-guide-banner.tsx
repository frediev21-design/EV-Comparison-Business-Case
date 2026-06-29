"use client";

import { useCaseStore } from "@/store/case-store";
import { getDataEntryProgress } from "@/lib/wizard-validation";
import { getFirstActiveStep } from "@/lib/wizard-steps";
import { getStepLabel } from "@/lib/wizard-steps";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";

const DISMISS_KEY = "fleet-tco-setup-guide-dismissed";

export function SetupGuideBanner() {
  const input = useCaseStore((s) => s.input);
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);
  const [dismissed, setDismissed] = useState(true);

  const { completed, total } = getDataEntryProgress(input, workflowMode);
  const setupComplete = completed >= total;
  const nextStep = getFirstActiveStep(workflowMode, input);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (dismissed || setupComplete) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold">Complete your setup ({completed}/{total} steps)</p>
        <p className="text-sm text-muted-foreground">
          Next: <span className="font-medium text-foreground">{getStepLabel(nextStep)}</span>
          {" "}— the dashboard and investment score update as you go.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button size="sm" onClick={() => setActiveStep(nextStep)}>
          Continue setup
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Dismiss setup guide"
          onClick={() => {
            sessionStorage.setItem(DISMISS_KEY, "1");
            setDismissed(true);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
