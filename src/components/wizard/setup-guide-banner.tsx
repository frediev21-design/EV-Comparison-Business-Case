"use client";

import { useCaseStore } from "@/store/case-store";
import {
  getNextIncompleteStep,
  getSetupProgress,
  isSetupComplete,
  shouldShowFullSetupBanner,
  nextStepPromptLabel,
} from "@/lib/workflow-guidance";
import { getStepLabel } from "@/lib/wizard-steps";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";

const DISMISS_KEY = "fleet-tco-setup-guide-dismissed";

function SlimNextStepStrip({
  completed,
  total,
  nextStep,
  onGo,
}: {
  completed: number;
  total: number;
  nextStep: ReturnType<typeof getNextIncompleteStep>;
  onGo: () => void;
}) {
  if (!nextStep) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
      <p className="text-muted-foreground">
        <span className="font-medium text-foreground">
          Step {completed + 1} of {total}
        </span>
        {" · "}
        Next:{" "}
        <button
          type="button"
          className="font-medium text-accent underline-offset-2 hover:underline"
          onClick={onGo}
        >
          {nextStepPromptLabel(nextStep)}
        </button>
      </p>
      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onGo}>
        Go there
        <ArrowRight className="ml-1 h-3 w-3" />
      </Button>
    </div>
  );
}

export function SetupGuideBanner() {
  const input = useCaseStore((s) => s.input);
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const activeStep = useCaseStore((s) => s.activeStep);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);
  const [dismissed, setDismissed] = useState(true);

  const { completed, total } = getSetupProgress(workflowMode, input);
  const setupComplete = isSetupComplete(workflowMode, input);
  const nextStep = getNextIncompleteStep(workflowMode, input);
  const showFull = shouldShowFullSetupBanner(completed);

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (setupComplete || !nextStep) return null;

  const goNext = () => setActiveStep(nextStep);

  if (!showFull || dismissed) {
    if (activeStep === nextStep) return null;
    return (
      <SlimNextStepStrip
        completed={completed}
        total={total}
        nextStep={nextStep}
        onGo={goNext}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold">Complete your setup ({completed}/{total} steps)</p>
        <p className="text-sm text-muted-foreground">
          Next:{" "}
          <span className="font-medium text-foreground">{getStepLabel(nextStep)}</span>
          {" "}— the dashboard and investment score update as you go.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button size="sm" onClick={goNext}>
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
