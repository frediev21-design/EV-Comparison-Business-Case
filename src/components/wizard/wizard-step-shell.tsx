"use client";

import type { WizardStep } from "@/store/case-store";
import { DATA_ENTRY_STEP_IDS } from "@/lib/wizard-steps";
import { WizardProgress } from "./wizard-progress";
import { WizardNav } from "./wizard-nav";

interface WizardStepShellProps {
  step: WizardStep;
  children: React.ReactNode;
}

export function WizardStepShell({ step, children }: WizardStepShellProps) {
  const isDataEntry = DATA_ENTRY_STEP_IDS.includes(step);

  if (!isDataEntry) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <WizardProgress />
      {children}
      <WizardNav step={step} />
    </div>
  );
}
