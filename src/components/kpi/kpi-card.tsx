"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";

interface KpiCardProps {
  title: string;
  value: string;
  /** When set, animates the displayed value using this numeric source. */
  numericValue?: number;
  formatValue?: (value: number) => string;
  subtitle?: string;
  /** Plain-language explainer shown below subtitle (e.g. for NPV). */
  helpText?: string;
  delta?: number;
  deltaLabel?: string;
  positiveIsGood?: boolean;
  className?: string;
}

export function KpiCard({
  title,
  value,
  numericValue,
  formatValue,
  subtitle,
  helpText,
  delta,
  deltaLabel,
  positiveIsGood = true,
  className,
}: KpiCardProps) {
  const isPositive = delta !== undefined && delta >= 0;
  const isGood = positiveIsGood ? isPositive : !isPositive;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-sm",
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight lg:text-3xl">
        {numericValue !== undefined && formatValue ? (
          <AnimatedNumber value={numericValue} format={formatValue} />
        ) : (
          value
        )}
      </p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      {helpText && <p className="mt-2 text-xs leading-relaxed text-muted-foreground/90">{helpText}</p>}
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
