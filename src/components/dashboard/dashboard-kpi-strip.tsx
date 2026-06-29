"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DashboardKpiStripProps {
  monthlySaving: number;
  amountFinanced: number;
  tenYearSaving: number;
  paybackMonths: number;
  className?: string;
}

export function DashboardKpiStrip({
  monthlySaving,
  amountFinanced,
  tenYearSaving,
  paybackMonths,
  className,
}: DashboardKpiStripProps) {
  const savingPositive = monthlySaving >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-4", className)}
    >
      <div
        className={cn(
          "rounded-xl border bg-card px-4 py-3 shadow-sm",
          savingPositive ? "border-success/25" : "border-destructive/25"
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Indicative monthly cash flow
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground/80">10-yr avg · post-loan aware</p>
        <p className={cn("mt-1 text-2xl font-bold tabular-nums", savingPositive ? "text-success" : "text-destructive")}>
          <AnimatedNumber value={monthlySaving} format={(n) => formatCurrency(n)} />
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Amount to finance
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums">
          <AnimatedNumber value={amountFinanced} format={(n) => formatCurrency(n)} />
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          10-year net TCO delta
        </p>
        <p className={cn("mt-1 text-2xl font-bold tabular-nums", tenYearSaving >= 0 ? "text-success" : "text-destructive")}>
          <AnimatedNumber value={tenYearSaving} format={(n) => formatCurrency(n)} />
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Indicative payback
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums">
          {paybackMonths > 0 ? `${paybackMonths} mo` : "N/A"}
        </p>
      </div>
    </motion.div>
  );
}
