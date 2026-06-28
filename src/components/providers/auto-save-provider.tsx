"use client";

import { useEffect, useRef } from "react";
import { useCaseStore } from "@/store/case-store";
import { scenarioRepository } from "@/lib/db";
import type { ScenarioRecord } from "@/engine/types";
import { snapshotForSave } from "@/lib/snapshot-sanitize";

export function AutoSaveProvider({ children }: { children: React.ReactNode }) {
  const caseId = useCaseStore((s) => s.caseId);
  const caseName = useCaseStore((s) => s.caseName);
  const tags = useCaseStore((s) => s.tags);
  const input = useCaseStore((s) => s.input);
  const inputGeneration = useCaseStore((s) => s.inputGeneration);
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const setCaseId = useCaseStore((s) => s.setCaseId);
  const setLastSavedAt = useCaseStore((s) => s.setLastSavedAt);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const generationRef = useRef(inputGeneration);

  useEffect(() => {
    generationRef.current = inputGeneration;
  }, [inputGeneration]);

  useEffect(() => {
    const saveNow = async () => {
      const state = useCaseStore.getState();
      const generationAtStart = state.inputGeneration;
      const now = new Date().toISOString();
      const id = state.caseId ?? crypto.randomUUID();
      const existing = state.caseId ? await scenarioRepository.get(state.caseId) : undefined;
      if (generationAtStart !== useCaseStore.getState().inputGeneration) return;

      const record: ScenarioRecord = {
        id,
        name: state.caseName,
        tags: state.tags,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        snapshot: snapshotForSave(state.input),
        workflowMode: state.workflowMode,
      };
      await scenarioRepository.save(record);
      if (generationAtStart !== useCaseStore.getState().inputGeneration) return;
      setCaseId(id);
      setLastSavedAt(now);
    };

    const handler = () => {
      void saveNow();
    };
    window.addEventListener("fleet-tco:save", handler);
    return () => window.removeEventListener("fleet-tco:save", handler);
  }, [setCaseId, setLastSavedAt]);

  useEffect(() => {
    const cancelHandler = () => {
      clearTimeout(timerRef.current);
    };
    window.addEventListener("fleet-tco:cancel-autosave", cancelHandler);
    return () => window.removeEventListener("fleet-tco:cancel-autosave", cancelHandler);
  }, []);

  useEffect(() => {
    if (!caseId) return;

    clearTimeout(timerRef.current);
    const generationAtSchedule = inputGeneration;
    timerRef.current = setTimeout(async () => {
      if (generationRef.current !== generationAtSchedule) return;

      const state = useCaseStore.getState();
      if (!state.caseId) return;

      const now = new Date().toISOString();
      const record: ScenarioRecord = {
        id: state.caseId,
        name: state.caseName,
        tags: state.tags,
        createdAt: now,
        updatedAt: now,
        snapshot: snapshotForSave(state.input),
        workflowMode: state.workflowMode,
      };
      const existing = await scenarioRepository.get(state.caseId);
      if (existing) record.createdAt = existing.createdAt;
      if (generationRef.current !== generationAtSchedule) return;
      await scenarioRepository.save(record);
      if (generationRef.current !== generationAtSchedule) return;
      setLastSavedAt(now);
    }, 2000);

    return () => clearTimeout(timerRef.current);
  }, [caseId, caseName, tags, input, inputGeneration, workflowMode, setLastSavedAt]);

  return <>{children}</>;
}
