"use client";

import { motion } from "framer-motion";
import { renderStars } from "@/engine/decision";
import type { InvestmentScore } from "@/engine/decision/types";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface ExecutiveScoreCardProps {
  score: InvestmentScore;
  className?: string;
}

export function ExecutiveScoreCard({ score, className }: ExecutiveScoreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-8 shadow-lg",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
      <div className="relative text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Executive Investment Score
        </p>
        <p className="mt-4 text-6xl font-bold tabular-nums tracking-tight lg:text-7xl">
          <AnimatedNumber value={score.total} format={(n) => `${Math.round(n)}`} durationMs={600} />
          <span className="text-2xl font-normal text-muted-foreground lg:text-3xl"> / 100</span>
        </p>
        <p className="mt-3 text-2xl tracking-widest text-warning">{renderStars(score.stars)}</p>
        <p className="mt-4 text-xl font-semibold text-accent">{score.rating.toUpperCase()}</p>
        <p className="mt-1 text-sm text-muted-foreground">{score.subtitle}</p>
      </div>
      <div className="relative mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {score.criteria.map((c) => (
          <div key={c.id} className="rounded-lg bg-background/60 px-3 py-2 text-xs">
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-medium tabular-nums">{Math.round(c.score)}</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${c.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
