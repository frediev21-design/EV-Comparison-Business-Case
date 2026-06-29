"use client";

import { motion } from "framer-motion";
import { renderStars } from "@/engine/decision";
import type { InvestmentScore, TrafficLight } from "@/engine/decision/types";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { cn } from "@/lib/utils";

const CRITERION_DISPLAY_LABELS: Record<string, string> = {
  vehicleReliability: "Current Vehicle Reliability",
};

function scoreBarColor(score: number): string {
  if (score >= 75) return "bg-success";
  if (score >= 55) return "bg-warning";
  return "bg-destructive";
}

function InvestmentScoreRing({ score, className }: { score: number; className?: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score)) / 100;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className={cn("relative flex shrink-0 items-center justify-center", className)}>
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-muted/60"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="text-primary transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold tabular-nums tracking-tight text-primary">
          <AnimatedNumber value={score} format={(n) => n.toFixed(1)} durationMs={600} />
        </span>
        <span className="text-sm font-medium text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

function VerticalTrafficLight({ trafficLight }: { trafficLight: TrafficLight }) {
  const lights: TrafficLight["status"][] = ["go", "review", "stop"];
  const activeStyles = {
    go: { dot: "bg-success ring-2 ring-success/30", text: "text-success" },
    review: { dot: "bg-warning ring-2 ring-warning/30", text: "text-warning" },
    stop: { dot: "bg-destructive ring-2 ring-destructive/30", text: "text-destructive" },
  } as const;

  const styles = activeStyles[trafficLight.status];
  const shortDescription =
    trafficLight.status === "go"
      ? "Financially Strong"
      : trafficLight.status === "review"
        ? "Needs Review"
        : "Not Recommended";

  return (
    <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-border bg-muted/20 px-5 py-6">
      <div className="flex flex-col items-center gap-3">
        {lights.map((status) => (
          <span
            key={status}
            className={cn(
              "h-3.5 w-3.5 rounded-full transition-all",
              status === trafficLight.status
                ? activeStyles[status].dot
                : "bg-muted-foreground/15"
            )}
          />
        ))}
      </div>
      <p className={cn("mt-5 text-lg font-bold tracking-wide", styles.text)}>{trafficLight.label}</p>
      <p className="mt-1 max-w-[7rem] text-center text-xs text-muted-foreground">{shortDescription}</p>
    </div>
  );
}

interface ExecutiveDashboardHeroProps {
  score: InvestmentScore;
  trafficLight: TrafficLight;
  className?: string;
}

export function ExecutiveDashboardHero({ score, trafficLight, className }: ExecutiveDashboardHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-sm lg:p-8",
        className
      )}
    >
      <div className="flex flex-col gap-8 xl:flex-row xl:items-stretch xl:gap-6">
        <div className="flex justify-center xl:justify-start xl:pt-2">
          <InvestmentScoreRing score={score.total} />
        </div>

        <div className="min-w-0 flex-1 space-y-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Executive Investment Score
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight lg:text-3xl">{score.rating}</h3>
            <p className="mt-2 text-lg tracking-[0.2em] text-warning">{renderStars(score.stars)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{score.subtitle}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {score.criteria.map((criterion) => {
              const label = CRITERION_DISPLAY_LABELS[criterion.id] ?? criterion.label;
              const weightPct = Math.round(criterion.weight * 100);
              return (
                <div key={criterion.id} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                    <p className="shrink-0 text-[11px] font-medium tabular-nums text-foreground">
                      {Math.round(criterion.score)} · {weightPct}%
                    </p>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        scoreBarColor(criterion.score)
                      )}
                      style={{ width: `${Math.max(0, Math.min(100, criterion.score))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center xl:justify-end">
          <VerticalTrafficLight trafficLight={trafficLight} />
        </div>
      </div>
    </motion.div>
  );
}
