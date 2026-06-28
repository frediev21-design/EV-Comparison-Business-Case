"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCaseStore } from "@/store/case-store";
import { scenarioRepository } from "@/lib/db";
import { runFullBusinessCase } from "@/engine";

function stripLegacyTradeWhatIf() {
  const state = useCaseStore.getState();
  const whatIf = state.input.whatIf;
  if (!whatIf?.outstandingFinance && !whatIf?.tradeValue) return;

  const { outstandingFinance, tradeValue, ...rest } = whatIf;
  void outstandingFinance;
  void tradeValue;
  const nextWhatIf = Object.keys(rest).length > 0 ? rest : undefined;
  const input = { ...state.input, whatIf: nextWhatIf };
  useCaseStore.setState({ input, result: runFullBusinessCase(input) });
}

export function CaseRouteSync() {
  const pathname = usePathname();
  const caseId = useCaseStore((s) => s.caseId);
  const loadCase = useCaseStore((s) => s.loadCase);
  const setLastSavedAt = useCaseStore((s) => s.setLastSavedAt);
  const setRouteCaseMissing = useCaseStore((s) => s.setRouteCaseMissing);

  useEffect(() => {
    stripLegacyTradeWhatIf();
  }, []);

  useEffect(() => {
    const match = pathname.match(/^\/case\/([^/?]+)/);
    if (!match || match[1] === "new") {
      setRouteCaseMissing(false);
      return;
    }

    const routeId = match[1];
    if (caseId === routeId) {
      setRouteCaseMissing(false);
      return;
    }

    scenarioRepository.get(routeId).then((record) => {
      if (!record) {
        setRouteCaseMissing(true);
        return;
      }
      setRouteCaseMissing(false);
      loadCase(record.snapshot, { id: record.id, name: record.name, tags: record.tags });
      setLastSavedAt(record.updatedAt);
    });
  }, [pathname, caseId, loadCase, setLastSavedAt, setRouteCaseMissing]);

  return null;
}
