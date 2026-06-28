"use client";

import { useCaseStore } from "@/store/case-store";
import { getDataEntryProgress } from "@/lib/wizard-validation";
import { cn } from "@/lib/utils";
import type { TrafficLightStatus } from "@/engine/decision/types";

const STATUS_RING: Record<TrafficLightStatus, string> = {
  go: "text-success border-success/40 bg-success/10",
  review: "text-warning border-warning/40 bg-warning/10",
  stop: "text-destructive border-destructive/40 bg-destructive/10",
};

const STATUS_DOT: Record<TrafficLightStatus, string> = {
  go: "bg-success",
  review: "bg-warning",
  stop: "bg-destructive",
};

function useHeaderScore() {
  const score = useCaseStore((s) => s.result.decision.investmentScore);
  const trafficLight = useCaseStore((s) => s.result.decision.trafficLight);
  const input = useCaseStore((s) => s.input);
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);
  const { completed, total } = getDataEntryProgress(input, workflowMode);

  return { score, trafficLight, completed, total, setActiveStep };
}

export function HeaderInvestmentScore() {
  const { score, trafficLight, completed, total, setActiveStep } = useHeaderScore();
  const setupComplete = completed >= total;

  return (
    <button
      type="button"
      onClick={() => setActiveStep("dashboard")}
      className={cn(
        "hidden items-center gap-3 rounded-lg border px-3 py-1.5 text-left transition-colors hover:bg-muted/60 sm:flex",
        STATUS_RING[trafficLight.status]
      )}
      title="Open executive dashboard"
    >
      <div className="flex flex-col items-center leading-none">
        <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">
          Investment score
        </span>
        <span className="mt-0.5 text-xl font-bold tabular-nums">
          {score.total}
          <span className="text-xs font-normal opacity-70">/100</span>
        </span>
      </div>
      <div className="h-8 w-px bg-current/20" />
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold">{score.rating}</p>
        <p className="text-[10px] opacity-80">
          {setupComplete ? "Inputs complete" : `${completed}/${total} setup steps`}
        </p>
      </div>
    </button>
  );
}

export function HeaderInvestmentScoreMobile() {
  const { score, trafficLight, completed, total, setActiveStep } = useHeaderScore();

  return (
    <button
      type="button"
      onClick={() => setActiveStep("dashboard")}
      className="flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1 sm:hidden"
      title={`Investment score ${score.total}/100 — ${completed}/${total} setup steps`}
    >
      <span className={cn("h-2 w-2 rounded-full", STATUS_DOT[trafficLight.status])} />
      <span className="text-sm font-bold tabular-nums">{score.total}</span>
    </button>
  );
}
