"use client";

import { useMarketStore } from "@/store/market-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { RefreshCw, Wifi } from "lucide-react";

export function MarketExecutiveSummaryPanel() {
  const summary = useMarketStore((s) => s.executiveSummary);
  const lastRefresh = useMarketStore((s) => s.lastRefresh);
  const loading = useMarketStore((s) => s.loading);
  const refreshAll = useMarketStore((s) => s.refreshAll);
  const newVehicle = useMarketStore((s) => s.newVehicleResult);
  const tradeIn = useMarketStore((s) => s.tradeInResult);
  const newVehicleError = useMarketStore((s) => s.newVehicleError);
  const tradeInError = useMarketStore((s) => s.tradeInError);

  if (!summary && !newVehicle && !tradeIn && !newVehicleError && !tradeInError) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          Search for a new vehicle and value your trade-in to see the market executive summary.
        </CardContent>
      </Card>
    );
  }

  if (!summary) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Market Executive Summary</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Wifi className="h-3 w-3" />
            {summary.sourceCount} sources
          </Badge>
          <Button size="sm" variant="outline" onClick={() => refreshAll()} disabled={loading}>
            <RefreshCw className={`mr-1 h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Recommended Purchase", value: summary.recommendedPurchasePrice },
            { label: "Recommended Trade-In", value: summary.recommendedTradeValue },
            { label: "Private Sale Value", value: summary.recommendedPrivateSaleValue },
            { label: "Finance Required", value: summary.financeRequired },
            { label: "Monthly Instalment", value: summary.monthlyInstalment },
            { label: "Negotiation Opportunity", value: summary.negotiationOpportunity },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-background p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-bold tabular-nums">{formatCurrency(value)}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Badge variant="success" className="text-sm">
            {summary.overallMarketRatingLabel}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Confidence: {summary.confidenceLevel}%
          </span>
          {lastRefresh && (
            <span className="text-xs text-muted-foreground">
              Price last updated: {new Date(lastRefresh).toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
