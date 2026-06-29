"use client";

import { useEffect } from "react";
import { useCaseStore } from "@/store/case-store";
import { useMarketStore, canAutoSearchMarket } from "@/store/market-store";
import { VehicleLookupPanel } from "./vehicle-lookup-panel";
import { TradeInValuationPanel } from "./trade-in-valuation-panel";
import { DealerQuotesPanel } from "./dealer-quotes-panel";
import { MarketExecutiveSummaryPanel } from "./market-executive-summary";
import { ArrowRight, Car, Search } from "lucide-react";

export function MarketIntelligenceStep() {
  const initFromCase = useMarketStore((s) => s.initFromCase);
  const refreshAll = useMarketStore((s) => s.refreshAll);
  const syncTradeInFromCase = useMarketStore((s) => s.syncTradeInFromCase);
  const currentLabel = useCaseStore((s) => {
    const c = s.input.current;
    return `${c.manufacturer} ${c.model}`.trim();
  });
  const replacement = useCaseStore((s) =>
    s.input.replacements.find((v) => v.id === s.input.selectedReplacementId)
  );

  useEffect(() => {
    initFromCase();
    syncTradeInFromCase();
    if (canAutoSearchMarket()) {
      void refreshAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate from case once
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">SA Market Intelligence</h2>
        <p className="text-sm text-muted-foreground">
          Look up replacement pricing and trade-in values, then apply them to your business case.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { step: "1", label: "Search replacement", icon: Search, detail: replacement?.name || "Enter a vehicle below" },
          { step: "2", label: "Value trade-in", icon: Car, detail: currentLabel || "Sync from Current Vehicle" },
          { step: "3", label: "Apply to case", icon: ArrowRight, detail: "Update finance & trade-in steps" },
        ].map(({ step, label, icon: Icon, detail }) => (
          <div
            key={step}
            className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {step}
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                {label}
              </p>
              <p className="truncate text-xs text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <MarketExecutiveSummaryPanel />
      <VehicleLookupPanel />
      <TradeInValuationPanel />
      <DealerQuotesPanel />
    </div>
  );
}
