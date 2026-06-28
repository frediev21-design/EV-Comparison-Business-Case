"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCaseStore } from "@/store/case-store";
import { scenarioRepository } from "@/lib/db";

export function CaseRouteSync() {
  const pathname = usePathname();
  const caseId = useCaseStore((s) => s.caseId);
  const loadCase = useCaseStore((s) => s.loadCase);
  const setLastSavedAt = useCaseStore((s) => s.setLastSavedAt);

  useEffect(() => {
    const match = pathname.match(/^\/case\/([^/?]+)/);
    if (!match || match[1] === "new") return;

    const routeId = match[1];
    if (caseId === routeId) return;

    scenarioRepository.get(routeId).then((record) => {
      if (!record) return;
      loadCase(record.snapshot, { id: record.id, name: record.name, tags: record.tags });
      setLastSavedAt(record.updatedAt);
    });
  }, [pathname, caseId, loadCase, setLastSavedAt]);

  return null;
}
