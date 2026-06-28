"use client";

import { useMarketStore } from "@/store/market-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { MARKET_RATING_LABELS } from "@/engine/market/types";
import { Search, RefreshCw, Check } from "lucide-react";

export function VehicleLookupPanel() {
  const query = useMarketStore((s) => s.newVehicleQuery);
  const result = useMarketStore((s) => s.newVehicleResult);
  const loading = useMarketStore((s) => s.loading);
  const setQuery = useMarketStore((s) => s.setNewVehicleQuery);
  const search = useMarketStore((s) => s.searchNewVehicle);
  const apply = useMarketStore((s) => s.applyNewVehiclePrice);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">New Vehicle Price Lookup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. BYD Shark 6"
            className="flex-1"
          />
          <Button onClick={() => search()} disabled={loading}>
            <Search className="mr-2 h-4 w-4" />
            Search SA Market
          </Button>
        </div>

        {result && (
          <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{result.manufacturer} {result.model}</p>
                <p className="text-sm text-muted-foreground">{result.variant}</p>
              </div>
              <Badge variant="success">{MARKET_RATING_LABELS[result.marketRating]}</Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Retail Price", value: result.retailPrice },
                { label: "Avg Dealer", value: result.averageDealerPrice },
                { label: "Lowest", value: result.lowestDealerPrice },
                { label: "Highest", value: result.highestDealerPrice },
                { label: "Recommended", value: result.recommendedPurchasePrice },
                { label: "Negotiation Target", value: result.negotiationTarget },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-md bg-background p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-bold tabular-nums">{formatCurrency(value)}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>Confidence: {result.confidenceScore}%</span>
              <span>Sources: {result.sourceCount}</span>
              <span>Updated: {new Date(result.priceLastUpdated).toLocaleString()}</span>
            </div>

            {result.promotions.length > 0 && (
              <div>
                <Label className="text-xs">Current Promotions</Label>
                <ul className="mt-1 text-sm">
                  {result.promotions.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="rounded-md bg-accent/10 p-3 text-sm leading-relaxed">{result.negotiationAdvice}</p>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={apply}>
                <Check className="mr-1 h-3 w-3" /> Apply to Business Case
              </Button>
              <Button size="sm" variant="outline" onClick={() => search()} disabled={loading}>
                <RefreshCw className="mr-1 h-3 w-3" /> Refresh
              </Button>
            </div>

            <div>
              <Label className="text-xs">Market Sources</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.sources.map((s) => (
                  <Badge key={s.id} variant="outline">
                    {s.name}: {formatCurrency(s.price)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
