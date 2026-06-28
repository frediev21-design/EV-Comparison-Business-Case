"use client";

import { useState } from "react";
import { useCaseStore } from "@/store/case-store";
import { fetchNewVehicleMarket, fetchTradeInMarket } from "@/lib/market/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { Globe, Loader2 } from "lucide-react";

export function MarketSyncCard() {
  const input = useCaseStore((s) => s.input);
  const updateCurrent = useCaseStore((s) => s.updateCurrent);
  const updateReplacement = useCaseStore((s) => s.updateReplacement);
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{ tradeValue?: number; vehiclePrice?: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleFetchMarketValues = async () => {
    setLoading(true);
    setError(null);
    try {
      const tradeInInput = {
        manufacturer: input.current.manufacturer,
        model: input.current.model,
        year: input.current.year,
        mileage: input.current.mileage,
        condition: "good" as const,
        serviceHistory: true,
        accidentHistory: false,
        province: "Gauteng",
      };

      const [tradeResult, vehicleResult] = await Promise.all([
        fetchTradeInMarket(tradeInInput),
        selected?.name
          ? fetchNewVehicleMarket(selected.name, selected.price)
          : Promise.resolve(null),
      ]);

      setPreview({
        tradeValue: tradeResult.tradeInValue,
        vehiclePrice: vehicleResult?.recommendedPurchasePrice,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Market lookup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!preview) return;
    if (preview.tradeValue !== undefined) {
      updateCurrent({
        currentValue: preview.tradeValue,
        tradeInValue: preview.tradeValue,
      });
    }
    if (preview.vehiclePrice !== undefined && selected) {
      updateReplacement(selected.id, { price: preview.vehiclePrice });
    }
    setPreview(null);
  };

  return (
    <Card className="border-accent/20 bg-accent/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="h-4 w-4 text-accent" />
          SA Market Values
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Pull trade-in and replacement prices from SA market data into this business case.
        </p>
        <Button variant="outline" size="sm" onClick={handleFetchMarketValues} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Globe className="mr-2 h-4 w-4" />
          )}
          Fetch market values
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {preview && (
          <div className="space-y-2 rounded-lg border border-border bg-background p-3 text-sm">
            {preview.tradeValue !== undefined && (
              <p>
                Trade-in value:{" "}
                <span className="font-semibold tabular-nums">{formatCurrency(preview.tradeValue)}</span>
              </p>
            )}
            {preview.vehiclePrice !== undefined && (
              <p>
                Replacement price:{" "}
                <span className="font-semibold tabular-nums">
                  {formatCurrency(preview.vehiclePrice)}
                </span>
              </p>
            )}
            <Button size="sm" onClick={handleApply}>
              Apply to business case
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
