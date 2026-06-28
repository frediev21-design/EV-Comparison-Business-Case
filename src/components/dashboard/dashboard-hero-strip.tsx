"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TrafficLightStatus } from "@/engine/decision/types";

interface DashboardHeroStripProps {
  monthlySaving: number;
  amountFinanced: number;
  investmentScore: number;
  rating: string;
  trafficLight: TrafficLightStatus;
}

const SCORE_RING: Record<TrafficLightStatus, string> = {
  go: "from-success/20 to-success/5 border-success/30",
  review: "from-warning/20 to-warning/5 border-warning/30",
  stop: "from-destructive/20 to-destructive/5 border-destructive/30",
};

export function DashboardHeroStrip({
  monthlySaving,
  amountFinanced,
  investmentScore,
  rating,
  trafficLight,
}: DashboardHeroStripProps) {
  const savingPositive = monthlySaving >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="grid gap-4 lg:grid-cols-3"
    >
      <div
        className={cn(
          "rounded-2xl border bg-gradient-to-br p-6 shadow-sm",
          savingPositive ? "from-success/15 to-card border-success/25" : "from-destructive/10 to-card border-destructive/25"
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Monthly saving
        </p>
        <p
          className={cn(
            "mt-2 text-4xl font-bold tracking-tight",
            savingPositive ? "text-success" : "text-destructive"
          )}
        >
          <AnimatedNumber value={monthlySaving} format={(n) => formatCurrency(n)} />
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Current vs replacement operating + finance</p>
      </div>

      <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Amount to finance
        </p>
        <p className="mt-2 text-4xl font-bold tracking-tight">
          <AnimatedNumber value={amountFinanced} format={(n) => formatCurrency(n)} />
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Replacement after trade-in and deposit</p>
      </div>

      <div
        className={cn(
          "rounded-2xl border bg-gradient-to-br p-6 shadow-sm",
          SCORE_RING[trafficLight]
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Investment score
        </p>
        <p className="mt-2 text-4xl font-bold tracking-tight">
          <AnimatedNumber value={investmentScore} format={(n) => `${Math.round(n)}`} />
          <span className="text-2xl font-normal text-muted-foreground"> /100</span>
        </p>
        <p className="mt-2 text-sm font-medium">{rating}</p>
      </div>
    </motion.div>
  );
}
