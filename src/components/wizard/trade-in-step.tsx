"use client";

import { useCaseStore } from "@/store/case-store";
import { FormField } from "./form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { ArrowDown, Minus, Plus, Equal } from "lucide-react";
import { motion } from "framer-motion";

function WaterfallRow({
  label,
  value,
  variant = "default",
  icon,
}: {
  label: string;
  value: number;
  variant?: "default" | "positive" | "negative" | "highlight";
  icon?: React.ReactNode;
}) {
  const colors = {
    default: "bg-muted/50",
    positive: "bg-success/10 text-success",
    negative: "bg-destructive/10 text-destructive",
    highlight: "bg-accent/10 text-accent",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center justify-between rounded-lg px-4 py-3 ${colors[variant]}`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-lg font-bold tabular-nums">{formatCurrency(value)}</span>
    </motion.div>
  );
}

export function TradeInStep() {
  const tradeIn = useCaseStore((s) => s.result.tradeIn);
  const current = useCaseStore((s) => s.input.current);
  const whatIf = useCaseStore((s) => s.input.whatIf);
  const additionalCash = useCaseStore((s) => s.input.tradeIn.additionalCashDeposit);
  const updateTradeIn = useCaseStore((s) => s.updateTradeIn);
  const updateCurrent = useCaseStore((s) => s.updateCurrent);
  const resetWhatIf = useCaseStore((s) => s.resetWhatIf);

  const num = (v: string) => parseFloat(v) || 0;
  const hasWhatIfOverrides =
    whatIf?.tradeValue !== undefined || whatIf?.outstandingFinance !== undefined;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Trade-In Calculator</h2>
        <p className="text-sm text-muted-foreground">
          Automatically calculated from current vehicle value and outstanding finance.
        </p>
        {hasWhatIfOverrides && (
          <p className="mt-2 text-xs text-warning">
            What-if overrides are active for trade value or outstanding finance. Edit below or{" "}
            <button type="button" className="underline" onClick={resetWhatIf}>
              reset what-if
            </button>{" "}
            to use saved vehicle values.
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Current Vehicle Value"
          type="number"
          prefix="R"
          value={current.currentValue}
          onChange={(v) => updateCurrent({ currentValue: num(v), tradeInValue: num(v) })}
        />
        <FormField
          label="Outstanding Finance"
          type="number"
          prefix="R"
          value={current.outstandingFinance}
          onChange={(v) => updateCurrent({ outstandingFinance: num(v) })}
        />
        <FormField
          label="Additional Cash Deposit"
          type="number"
          prefix="R"
          value={additionalCash}
          onChange={(v) => updateTradeIn({ additionalCashDeposit: num(v) })}
          className="sm:col-span-2"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trade-In Waterfall</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <WaterfallRow label="Current Vehicle Value" value={tradeIn.currentVehicleValue} />
          <div className="flex justify-center py-1">
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <WaterfallRow
            label="Less Outstanding Finance"
            value={tradeIn.outstandingFinance}
            variant="negative"
            icon={<Minus className="h-4 w-4" />}
          />
          <div className="flex justify-center py-1">
            <Equal className="h-4 w-4 text-muted-foreground" />
          </div>
          <WaterfallRow label="Trade Equity" value={tradeIn.tradeEquity} variant="positive" />
          <div className="flex justify-center py-1">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
          <WaterfallRow label="Additional Cash Deposit" value={tradeIn.additionalCash} />
          <div className="flex justify-center py-1">
            <Equal className="h-4 w-4 text-muted-foreground" />
          </div>
          <WaterfallRow label="Total Deposit Available" value={tradeIn.totalDeposit} variant="highlight" />
          <div className="my-4 border-t border-border" />
          <WaterfallRow label="Vehicle Price" value={tradeIn.vehiclePrice} />
          <WaterfallRow label="Amount Financed" value={tradeIn.amountFinanced} variant="highlight" />
        </CardContent>
      </Card>
    </div>
  );
}
