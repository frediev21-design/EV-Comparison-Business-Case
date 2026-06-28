"use client";

import { useEffect } from "react";
import { useMarketStore } from "@/store/market-store";
import { VehicleLookupPanel } from "./vehicle-lookup-panel";
import { TradeInValuationPanel } from "./trade-in-valuation-panel";
import { DealerQuotesPanel } from "./dealer-quotes-panel";
import { MarketExecutiveSummaryPanel } from "./market-executive-summary";

export function MarketIntelligenceStep() {
  const initFromCase = useMarketStore((s) => s.initFromCase);
  const refreshAll = useMarketStore((s) => s.refreshAll);
  const error = useMarketStore((s) => s.error);

  useEffect(() => {
    initFromCase();
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight">SA Market Intelligence</h2>
        <p className="text-sm text-muted-foreground">
          ADDON-002 · Live South African vehicle pricing from AutoTrader, Cars.co.za, WeBuyCars, dealers &amp; manufacturers
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <MarketExecutiveSummaryPanel />
      <VehicleLookupPanel />
      <TradeInValuationPanel />
      <DealerQuotesPanel />
    </div>
  );
}
