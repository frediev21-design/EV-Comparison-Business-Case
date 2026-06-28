"use client";

import { useCallback } from "react";
import { useCaseStore } from "@/store/case-store";
import { scenarioRepository } from "@/lib/db";
import type { ScenarioRecord } from "@/engine/types";
import { snapshotForSave } from "@/lib/snapshot-sanitize";
import { showToast } from "@/lib/toast";

export function useScenarioSave() {
  return useCallback(async (options?: { toast?: boolean; message?: string }) => {
    const { input, caseId, caseName, tags, workflowMode, setCaseId, setLastSavedAt } =
      useCaseStore.getState();
    const now = new Date().toISOString();
    const id = caseId ?? crypto.randomUUID();
    const existing = caseId ? await scenarioRepository.get(caseId) : undefined;
    const record: ScenarioRecord = {
      id,
      name: caseName,
      tags,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      snapshot: snapshotForSave(input),
      workflowMode,
    };
    await scenarioRepository.save(record);
    setCaseId(id);
    setLastSavedAt(now);
    if (options?.toast !== false) {
      showToast(options?.message ?? "Scenario saved", "success");
    }
    return record;
  }, []);
}
