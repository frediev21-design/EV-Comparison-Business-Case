"use client";

import type { WizardStep } from "@/store/case-store";
import { DATA_ENTRY_STEP_IDS } from "@/lib/wizard-steps";
import { WizardProgress } from "./wizard-progress";
import { WizardNav } from "./wizard-nav";
import { NewCaseResetBar } from "@/components/case/new-case-reset";
import { SetupGuideBanner } from "@/components/wizard/setup-guide-banner";

interface WizardStepShellProps {
  step: WizardStep;
  children: React.ReactNode;
}

export function WizardStepShell({ step, children }: WizardStepShellProps) {
  const isDataEntry = DATA_ENTRY_STEP_IDS.includes(step);
  const guided = (
    <>
      <SetupGuideBanner />
      {children}
    </>
  );

  if (!isDataEntry) {
    return <div className="space-y-6">{guided}</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-24 lg:pb-0">
      <NewCaseResetBar />
      <WizardProgress />
      {guided}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="mx-auto max-w-5xl">
          <WizardNav step={step} />
        </div>
      </div>
    </div>
  );
}
