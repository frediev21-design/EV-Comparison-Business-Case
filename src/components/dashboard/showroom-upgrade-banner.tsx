"use client";

import Link from "next/link";
import { useCaseStore } from "@/store/case-store";
import { Button } from "@/components/ui/button";
import { buildMainAppCaseUrl } from "@/lib/embed";
import { ExternalLink, Info, List, Zap } from "lucide-react";

export function ShowroomUpgradeBanner() {
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const embedSession = useCaseStore((s) => s.embedSession);
  const caseId = useCaseStore((s) => s.caseId);
  const setWorkflowMode = useCaseStore((s) => s.setWorkflowMode);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);

  if (workflowMode !== "showroom") return null;

  const openQuick = () => {
    if (embedSession) {
      window.location.href = buildMainAppCaseUrl(caseId, "quick");
      return;
    }
    setWorkflowMode("quick");
    setActiveStep("market");
  };

  const openFull = () => {
    if (embedSession) {
      window.location.href = buildMainAppCaseUrl(caseId, "full");
      return;
    }
    setWorkflowMode("full");
    setActiveStep("finance");
  };

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
      <div className="flex gap-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div className="text-sm">
          <p className="font-medium">Showroom mode — fast path to the dashboard</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Finance, running costs, and risk use preset assumptions. Add market data, what-if
            sliders, or full setup when the buyer wants more detail.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={openQuick}>
          <Zap className="mr-2 h-4 w-4" />
          Open Quick mode
        </Button>
        <Button variant="outline" size="sm" onClick={openFull}>
          <List className="mr-2 h-4 w-4" />
          Full setup
        </Button>
        {embedSession && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={buildMainAppCaseUrl(caseId, "full")}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in SwitchSave
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
