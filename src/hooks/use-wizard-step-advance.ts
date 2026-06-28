"use client";

import { useCallback, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCaseStore, type WizardStep } from "@/store/case-store";
import { getNextStep, type WorkflowMode } from "@/lib/wizard-steps";
import { isStepComplete } from "@/lib/wizard-validation";
import { useScenarioSave } from "@/hooks/use-scenario-save";
import { DATA_ENTRY_STEP_IDS } from "@/lib/wizard-steps";
import { showToast } from "@/lib/toast";

function defaultCaseNameFromVehicle(manufacturer: string, model: string): string | null {
  const name = `${manufacturer} ${model}`.trim();
  return name.length > 0 ? name : null;
}

export function useWizardStepAdvance() {
  const router = useRouter();
  const pathname = usePathname();
  const input = useCaseStore((s) => s.input);
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);
  const saveScenario = useScenarioSave();
  const [saving, setSaving] = useState(false);

  const advanceFromStep = useCallback(
    async (step: WizardStep, mode: WorkflowMode = workflowMode): Promise<boolean> => {
      if (!isStepComplete(step, input)) return false;

      const next = getNextStep(step, mode) ?? "dashboard";
      const shouldPersist = DATA_ENTRY_STEP_IDS.includes(step);

      if (shouldPersist) {
        setSaving(true);
        try {
          const state = useCaseStore.getState();
          if (step === "current" && state.caseName === "Current Situation") {
            const autoName = defaultCaseNameFromVehicle(
              input.current.manufacturer,
              input.current.model
            );
            if (autoName) state.setCaseName(autoName);
          }

          const record = await saveScenario({ toast: false });
          showToast("Progress saved", "success");
          const isNewRoute = pathname.endsWith("/case/new");

          if (isNewRoute && record.id) {
            router.replace(`/case/${record.id}?step=${next}`, { scroll: false });
          }
        } finally {
          setSaving(false);
        }
      }

      setActiveStep(next);
      return true;
    },
    [input, workflowMode, saveScenario, pathname, router, setActiveStep]
  );

  return { advanceFromStep, saving, isStepComplete: (step: WizardStep) => isStepComplete(step, input) };
}
