"use client";

import { useCaseStore } from "@/store/case-store";
import { getNextStep, getPrevStep, getStepLabel } from "@/lib/wizard-steps";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { WizardStep } from "@/store/case-store";

interface WizardNavProps {
  step: WizardStep;
}

export function WizardNav({ step }: WizardNavProps) {
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);

  const prev = getPrevStep(step, workflowMode);
  const next = getNextStep(step, workflowMode);

  return (
    <div className="flex items-center justify-between border-t border-border pt-4">
      {prev ? (
        <Button variant="outline" onClick={() => setActiveStep(prev)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {getStepLabel(prev)}
        </Button>
      ) : (
        <div />
      )}
      {next ? (
        <Button onClick={() => setActiveStep(next)}>
          Continue to {getStepLabel(next)}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={() => setActiveStep("dashboard")}>
          View Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
