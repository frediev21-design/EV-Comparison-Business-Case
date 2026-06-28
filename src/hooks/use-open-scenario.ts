"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ScenarioRecord } from "@/engine/types";
import type { WizardStep } from "@/store/case-store";
import { useCaseStore } from "@/store/case-store";
import { getResumeStep } from "@/lib/scenario-preview";
import type { WorkflowMode } from "@/lib/wizard-steps";
import { showToast } from "@/lib/toast";

export interface OpenScenarioOptions {
  step?: WizardStep;
  workflowMode?: WorkflowMode;
  skipNavigation?: boolean;
}

export function resolveOpenScenarioStep(
  record: ScenarioRecord,
  options?: OpenScenarioOptions
): WizardStep {
  const mode = options?.workflowMode ?? record.workflowMode ?? "full";
  return options?.step ?? getResumeStep(record.snapshot, mode);
}

export function useOpenScenario() {
  const router = useRouter();
  const loadCase = useCaseStore((s) => s.loadCase);

  return useCallback(
    (record: ScenarioRecord, options?: OpenScenarioOptions) => {
      const workflowMode = options?.workflowMode ?? record.workflowMode ?? "full";
      const step = resolveOpenScenarioStep(record, { ...options, workflowMode });

      loadCase(record.snapshot, {
        id: record.id,
        name: record.name,
        tags: record.tags,
        workflowMode,
        activeStep: step,
        lastSavedAt: record.updatedAt,
      });

      if (!options?.skipNavigation) {
        router.push(`/case/${record.id}?step=${step}`);
      }

      showToast(`Opened "${record.name}"`, "success");
      return step;
    },
    [loadCase, router]
  );
}
