"use client";

import Link from "next/link";
import { useCaseStore } from "@/store/case-store";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function CaseNotFoundBanner() {
  const missing = useCaseStore((s) => s.routeCaseMissing);
  const setRouteCaseMissing = useCaseStore((s) => s.setRouteCaseMissing);

  if (!missing) return null;

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
        <div>
          <p className="text-sm font-medium">This case link is not on this device</p>
          <p className="text-xs text-muted-foreground">
            Cases are stored in your browser. Open a saved scenario from Scenarios, import a JSON
            export, or start a new analysis.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setRouteCaseMissing(false)}>
          Dismiss
        </Button>
        <Button size="sm" asChild>
          <Link href="/case/new">Start new analysis</Link>
        </Button>
      </div>
    </div>
  );
}
