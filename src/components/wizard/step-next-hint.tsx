"use client";

import { useCaseStore } from "@/store/case-store";
import { getNextIncompleteStep, isSetupComplete, nextStepPromptLabel } from "@/lib/workflow-guidance";
import { Check } from "lucide-react";
import { getNextStep, getStepLabel } from "@/lib/wizard-steps";
import type { WizardStep } from "@/store/case-store";

interface StepNextHintProps {
  step: WizardStep;
  stepReady: boolean;
}

export function StepNextHint({ step, stepReady }: StepNextHintProps) {
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const next = getNextStep(step, workflowMode);

  if (!stepReady || !next) return null;

  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground" role="status">
      <Check className="h-3.5 w-3.5 text-success" />
      <span>
        {getStepLabel(step)} ready · Next:{" "}
        <span className="font-medium text-foreground">{getStepLabel(next)}</span>
      </span>
    </p>
  );
}

export function HeaderNextStepLink() {
  const input = useCaseStore((s) => s.input);
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);

  const nextStep = getNextIncompleteStep(workflowMode, input);
  if (isSetupComplete(workflowMode, input) || !nextStep) return null;

  return (
    <span
      role="link"
      tabIndex={0}
      className="hidden text-[10px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline md:inline"
      onClick={(event) => {
        event.stopPropagation();
        setActiveStep(nextStep);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          setActiveStep(nextStep);
        }
      }}
    >
      Next: {nextStepPromptLabel(nextStep)}
    </span>
  );
}
