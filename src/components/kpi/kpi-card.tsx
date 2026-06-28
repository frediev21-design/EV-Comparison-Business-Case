"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  delta?: number;
  deltaLabel?: string;
  positiveIsGood?: boolean;
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  delta,
  deltaLabel,
  positiveIsGood = true,
  className,
}: KpiCardProps) {
  const isPositive = delta !== undefined && delta >= 0;
  const isGood = positiveIsGood ? isPositive : !isPositive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-sm",
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight lg:text-3xl">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      {delta !== undefined && (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
            isGood ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          )}
        >
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {deltaLabel ?? `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`}
        </div>
      )}
    </motion.div>
  );
}
