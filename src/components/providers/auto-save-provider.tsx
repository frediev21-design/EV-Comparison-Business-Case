"use client";

import { useEffect, useRef } from "react";
import { useCaseStore } from "@/store/case-store";
import { scenarioRepository } from "@/lib/db";
import type { ScenarioRecord } from "@/engine/types";

export function AutoSaveProvider({ children }: { children: React.ReactNode }) {
  const caseId = useCaseStore((s) => s.caseId);
  const caseName = useCaseStore((s) => s.caseName);
  const tags = useCaseStore((s) => s.tags);
  const input = useCaseStore((s) => s.input);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!caseId) return;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const now = new Date().toISOString();
      const record: ScenarioRecord = {
        id: caseId,
        name: caseName,
        tags,
        createdAt: now,
        updatedAt: now,
        snapshot: input,
      };
      const existing = await scenarioRepository.get(caseId);
      if (existing) record.createdAt = existing.createdAt;
      await scenarioRepository.save(record);
    }, 2000);

    return () => clearTimeout(timerRef.current);
  }, [caseId, caseName, tags, input]);

  return <>{children}</>;
}
