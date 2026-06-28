"use client";

import { useCaseStore } from "@/store/case-store";
import { getNextStep, getPrevStep, getStepLabel } from "@/lib/wizard-steps";
import { getStepIncompleteHint } from "@/lib/wizard-validation";
import { useWizardStepAdvance } from "@/hooks/use-wizard-step-advance";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import type { WizardStep } from "@/store/case-store";

interface WizardNavProps {
  step: WizardStep;
}

export function WizardNav({ step }: WizardNavProps) {
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const input = useCaseStore((s) => s.input);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);
  const { advanceFromStep, saving, isStepComplete } = useWizardStepAdvance();

  const prev = getPrevStep(step, workflowMode);
  const next = getNextStep(step, workflowMode);
  const stepReady = isStepComplete(step);

  const handleContinue = async () => {
    if (next) {
      await advanceFromStep(step);
      return;
    }
    if (stepReady) {
      await advanceFromStep(step);
    } else {
      setActiveStep("dashboard");
    }
  };

  return (
    <div className="space-y-3 border-t border-border pt-4">
      {!stepReady && (
        <p className="text-xs text-muted-foreground">
          {getStepIncompleteHint(step, input)}
        </p>
      )}
      {stepReady && step === "vehicles" && (
        <p className="text-xs text-muted-foreground">
          Continuing will save your vehicles to this scenario.
        </p>
      )}
      <div className="flex items-center justify-between">
        {prev ? (
          <Button variant="outline" onClick={() => setActiveStep(prev)} disabled={saving}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {getStepLabel(prev)}
          </Button>
        ) : (
          <div />
        )}
        {next ? (
          <Button onClick={handleContinue} disabled={!stepReady || saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                Continue to {getStepLabel(next)}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleContinue} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                View Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
