"use client";

import type { WizardStep } from "@/store/case-store";
import { DATA_ENTRY_STEP_IDS } from "@/lib/wizard-steps";
import { WizardProgress } from "./wizard-progress";
import { WizardNav } from "./wizard-nav";

import { cn } from "@/lib/utils";

interface WizardStepShellProps {
  step: WizardStep;
  children: React.ReactNode;
}

export function WizardStepShell({ step, children }: WizardStepShellProps) {
  const isDataEntry = DATA_ENTRY_STEP_IDS.includes(step);
  const isWide = step === "vehicles";

  if (!isDataEntry) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "mx-auto space-y-6 pb-24 lg:pb-0",
        isWide ? "max-w-7xl" : "max-w-5xl"
      )}
    >
      <WizardProgress />
      {children}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-4 py-3 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className={cn("mx-auto", isWide ? "max-w-7xl" : "max-w-5xl")}>
          <WizardNav step={step} />
        </div>
      </div>
    </div>
  );
}
