"use client";

import { useCaseStore } from "@/store/case-store";
import { getCaseValidationMessages } from "@/lib/wizard-validation";
import { ValidationAlerts } from "./validation-alerts";
import { MarketSyncCard } from "./market-sync-card";
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
  const input = useCaseStore((s) => s.input);
  const result = useCaseStore((s) => s.result);
  const current = input.current;
  const fleetCount = input.assumptions.fleetVehicleCount ?? 1;
  const additionalCashPerVehicle = input.tradeIn?.additionalCashDeposit ?? 0;
  const updateTradeIn = useCaseStore((s) => s.updateTradeIn);
  const updateCurrent = useCaseStore((s) => s.updateCurrent);
  const validationMessages = getCaseValidationMessages(input, result);

  const num = (v: string) => parseFloat(v) || 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <ValidationAlerts messages={validationMessages} step="trade-in" />
      <MarketSyncCard />
      <div>
        <h2 className="text-lg font-semibold">Trade-In Calculator</h2>
        <p className="text-sm text-muted-foreground">
          Calculated from your Current Vehicle entries — trade value and outstanding finance.
        </p>
        {input.assumptions.fleetVehicleCount > 1 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Fleet mode: totals shown for {input.assumptions.fleetVehicleCount} identical vehicles (per-vehicle values × fleet size).
          </p>
        )}
      </div>

      {tradeIn.tradeEquity > 0 && (
        <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm">
          You have{" "}
          <span className="font-semibold tabular-nums">{formatCurrency(tradeIn.tradeEquity)}</span>{" "}
          trade equity toward your replacement (value minus outstanding finance).
        </div>
      )}

      {tradeIn.tradeEquity < 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
          You have{" "}
          <span className="font-semibold tabular-nums">{formatCurrency(Math.abs(tradeIn.tradeEquity))}</span>{" "}
          negative equity — the shortfall is added to the replacement finance amount.
        </div>
      )}

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
          label={fleetCount > 1 ? "Additional Cash Deposit (per vehicle)" : "Additional Cash Deposit"}
          type="number"
          prefix="R"
          value={additionalCashPerVehicle}
          onChange={(v) => updateTradeIn({ additionalCashDeposit: num(v) })}
          hint={
            fleetCount > 1
              ? `Fleet ×${fleetCount}: ${formatCurrency(additionalCashPerVehicle * fleetCount)} total cash deposit.`
              : "Extra cash you put in on top of trade equity."
          }
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
          <WaterfallRow
            label="Trade Equity"
            value={tradeIn.tradeEquity}
            variant={tradeIn.tradeEquity < 0 ? "negative" : "positive"}
          />
          <div className="flex justify-center py-1">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
          <WaterfallRow
            label={
              fleetCount > 1
                ? `Additional Cash Deposit (×${fleetCount} fleet)`
                : "Additional Cash Deposit"
            }
            value={tradeIn.additionalCash}
          />
          <div className="flex justify-center py-1">
            <Equal className="h-4 w-4 text-muted-foreground" />
          </div>
          <WaterfallRow
            label="Total Deposit Available"
            value={tradeIn.totalDeposit}
            variant={tradeIn.totalDeposit < 0 ? "negative" : "highlight"}
          />
          <div className="my-4 border-t border-border" />
          <WaterfallRow label="Vehicle Price" value={tradeIn.vehiclePrice} />
          <WaterfallRow label="Amount Financed" value={tradeIn.amountFinanced} variant="highlight" />
        </CardContent>
      </Card>
    </div>
  );
}
