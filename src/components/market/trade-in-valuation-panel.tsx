"use client";

import { useMarketStore } from "@/store/market-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { SA_PROVINCES, type VehicleCondition } from "@/engine/market/types";
import { Search, Check, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useCaseStore } from "@/store/case-store";
import { PriceHistoryChart } from "./price-history-chart";

const CONDITIONS: { value: VehicleCondition; label: string }[] = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "average", label: "Average" },
  { value: "below_average", label: "Below Average" },
  { value: "poor", label: "Poor" },
];

export function TradeInValuationPanel() {
  const input = useMarketStore((s) => s.tradeInInput);
  const result = useMarketStore((s) => s.tradeInResult);
  const error = useMarketStore((s) => s.tradeInError);
  const loading = useMarketStore((s) => s.loading);
  const setField = useMarketStore((s) => s.setTradeInField);
  const search = useMarketStore((s) => s.searchTradeIn);
  const apply = useMarketStore((s) => s.applyTradeInValue);
  const syncFromCase = useMarketStore((s) => s.syncTradeInFromCase);
  const caseCurrent = useCaseStore((s) => s.input.current);
  const hasCaseVehicle = Boolean(caseCurrent.manufacturer.trim() && caseCurrent.model.trim());

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="text-base">Trade-In Valuation</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Uses your current vehicle details — sync from the business case or edit below.
          </p>
        </div>
        {hasCaseVehicle && (
          <Button type="button" variant="outline" size="sm" onClick={() => syncFromCase()}>
            <RefreshCw className="mr-1 h-3 w-3" />
            Use current vehicle
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Manufacturer</Label>
            <Input value={input.manufacturer} onChange={(e) => setField("manufacturer", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Model</Label>
            <Input value={input.model} onChange={(e) => setField("model", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Year</Label>
            <Input type="number" value={input.year} onChange={(e) => setField("year", parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-1.5">
            <Label>Mileage (km)</Label>
            <Input type="number" value={input.mileage} onChange={(e) => setField("mileage", parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-1.5">
            <Label>Condition</Label>
            <select
              value={input.condition}
              onChange={(e) => setField("condition", e.target.value as VehicleCondition)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Province</Label>
            <select
              value={input.province ?? "Gauteng"}
              onChange={(e) => setField("province", e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {SA_PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={input.serviceHistory} onChange={(e) => setField("serviceHistory", e.target.checked)} />
            Full service history
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={input.accidentHistory} onChange={(e) => setField("accidentHistory", e.target.checked)} />
            Accident history
          </label>
        </div>

        <Button onClick={() => search()} disabled={loading || !input.manufacturer.trim() || !input.model.trim()}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Value Trade-In
        </Button>

        {error && !result && (
          <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!input.manufacturer.trim() || !input.model.trim() ? (
          <p className="text-xs text-muted-foreground">
            Complete the Current Vehicle step or click &quot;Use current vehicle&quot; to pre-fill these fields.
          </p>
        ) : null}

        {result && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { label: "Trade-In", value: result.tradeInValue },
                { label: "Private Sale", value: result.privateSale },
                { label: "Dealer Retail", value: result.dealerRetail },
                { label: "Auction", value: result.auctionValue },
                { label: "Recommended", value: result.recommendedSellingPrice },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-md border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-bold tabular-nums">{formatCurrency(value)}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <Badge variant={result.demand === "high" ? "success" : result.demand === "medium" ? "outline" : "destructive"}>
                {result.demand.toUpperCase()} DEMAND
              </Badge>
              <span className="text-muted-foreground">{result.demandReason}</span>
              <span className="text-muted-foreground">Min {formatCurrency(result.minimum)} · Avg {formatCurrency(result.average)} · Max {formatCurrency(result.maximum)}</span>
            </div>

            <p className="rounded-md bg-muted/50 p-3 text-sm leading-relaxed">{result.tradeInAdvice}</p>

            <PriceHistoryChart history={result.priceHistory} future={result.futureResale} />

            <div className="grid gap-2 sm:grid-cols-4">
              {result.futureResale.map((f) => (
                <div key={f.years} className="rounded-md bg-muted/30 p-3 text-center">
                  <p className="text-xs text-muted-foreground">{f.years}-Year Resale</p>
                  <p className="font-bold tabular-nums">{formatCurrency(f.value)}</p>
                  <p className="text-xs text-muted-foreground">{f.residualPercent}% residual</p>
                </div>
              ))}
            </div>

            <Button size="sm" onClick={apply}>
              <Check className="mr-1 h-3 w-3" /> Apply Trade Value to Business Case
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
