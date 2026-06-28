"use client";

import type { TrafficLight } from "@/engine/decision/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  go: {
    bg: "bg-success/10 border-success/30",
    dot: "bg-success",
    text: "text-success",
  },
  review: {
    bg: "bg-warning/10 border-warning/30",
    dot: "bg-warning",
    text: "text-warning",
  },
  stop: {
    bg: "bg-destructive/10 border-destructive/30",
    dot: "bg-destructive",
    text: "text-destructive",
  },
};

export function DecisionTrafficLight({ trafficLight }: { trafficLight: TrafficLight }) {
  const styles = STATUS_STYLES[trafficLight.status];

  return (
    <div className={cn("rounded-xl border p-6", styles.bg)}>
      <div className="flex items-center gap-4">
        <div className={cn("h-4 w-4 rounded-full shadow-lg", styles.dot)} />
        <div>
          <p className={cn("text-lg font-bold tracking-wide", styles.text)}>
            {trafficLight.label}
          </p>
          <p className="text-sm text-muted-foreground">{trafficLight.description}</p>
        </div>
      </div>
    </div>
  );
}

export function DecisionTrafficLightRow() {
  const lights = [
    { status: "go" as const, label: "GO", desc: "Financially Strong" },
    { status: "review" as const, label: "REVIEW", desc: "Requires Further Analysis" },
    { status: "stop" as const, label: "DO NOT PROCEED", desc: "Investment Not Recommended" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {lights.map((light) => {
        const styles = STATUS_STYLES[light.status];
        return (
          <div
            key={light.status}
            className={cn("rounded-lg border px-4 py-3 text-center", styles.bg)}
          >
            <div className={cn("mx-auto mb-2 h-3 w-3 rounded-full", styles.dot)} />
            <p className={cn("text-sm font-bold", styles.text)}>{light.label}</p>
            <p className="text-xs text-muted-foreground">{light.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
