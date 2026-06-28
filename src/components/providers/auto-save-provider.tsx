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
  const setCaseId = useCaseStore((s) => s.setCaseId);
  const setLastSavedAt = useCaseStore((s) => s.setLastSavedAt);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const saveNow = async () => {
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
      setLastSavedAt(now);
    };

    const handler = () => {
      saveNow();
    };
    window.addEventListener("fleet-tco:save", handler);
    return () => window.removeEventListener("fleet-tco:save", handler);
  }, [caseId, caseName, tags, input, setCaseId, setLastSavedAt]);

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
      setLastSavedAt(now);
    }, 2000);

    return () => clearTimeout(timerRef.current);
  }, [caseId, caseName, tags, input, setLastSavedAt]);

  return <>{children}</>;
}
