"use client";

import { useCallback } from "react";
import { useCaseStore } from "@/store/case-store";
import { scenarioRepository } from "@/lib/db";
import type { ScenarioRecord } from "@/engine/types";

export function useScenarioSave() {
  const input = useCaseStore((s) => s.input);
  const caseId = useCaseStore((s) => s.caseId);
  const caseName = useCaseStore((s) => s.caseName);
  const tags = useCaseStore((s) => s.tags);
  const setCaseId = useCaseStore((s) => s.setCaseId);

  return useCallback(async () => {
    const now = new Date().toISOString();
    const id = caseId ?? crypto.randomUUID();
    const existing = caseId ? await scenarioRepository.get(caseId) : undefined;
    const record: ScenarioRecord = {
      id,
      name: caseName,
      tags,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      snapshot: input,
    };
    await scenarioRepository.save(record);
    setCaseId(id);
    return record;
  }, [caseId, caseName, tags, input, setCaseId]);
}
