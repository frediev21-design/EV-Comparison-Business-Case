"use client";

import { useMemo } from "react";
import { useMarketStore } from "@/store/market-store";
import { searchNewVehicles, listNewVehicleLabels } from "@/engine/market";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { MARKET_RATING_LABELS } from "@/engine/market/types";
import { Search, RefreshCw, Check, Loader2, AlertCircle } from "lucide-react";

export function VehicleLookupPanel() {
  const query = useMarketStore((s) => s.newVehicleQuery);
  const result = useMarketStore((s) => s.newVehicleResult);
  const error = useMarketStore((s) => s.newVehicleError);
  const loading = useMarketStore((s) => s.loading);
  const setQuery = useMarketStore((s) => s.setNewVehicleQuery);
  const search = useMarketStore((s) => s.searchNewVehicle);
  const apply = useMarketStore((s) => s.applyNewVehiclePrice);

  const suggestions = useMemo(() => searchNewVehicles(query, 5), [query]);
  const catalog = useMemo(() => listNewVehicleLabels(), []);

  const handleSearch = () => void search();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">New Vehicle Price Lookup</CardTitle>
        <p className="text-sm text-muted-foreground">
          Search curated SA market data — select a suggestion or type a brand/model.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g. Jetour Dashing, BYD Shark 6"
            className="flex-1"
            aria-label="New vehicle search"
          />
          <Button onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Search SA Market
          </Button>
        </div>

        {query.trim().length > 0 && suggestions.length > 0 && !result && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Suggestions</Label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((vehicle) => {
                const label = `${vehicle.manufacturer} ${vehicle.model}`;
                return (
                  <button
                    key={label}
                    type="button"
                    className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      setQuery(label);
                      void search();
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!query.trim() && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Available in database</Label>
            <div className="flex flex-wrap gap-2">
              {catalog.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
                  onClick={() => {
                    setQuery(label);
                    void search();
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && !result && (
          <div className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">No match found</p>
              <p className="mt-1 text-destructive/90">{error}</p>
              <p className="mt-2 text-xs text-destructive/80">
                Try a suggestion above or complete the New Vehicle step first — only listed SA models are in the database for now.
              </p>
            </div>
          </div>
        )}

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
              <Button size="sm" variant="outline" onClick={handleSearch} disabled={loading}>
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
