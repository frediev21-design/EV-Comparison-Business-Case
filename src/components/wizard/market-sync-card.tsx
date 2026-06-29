"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCaseStore } from "@/store/case-store";
import {
  getReplacementMarketQuery,
  isCurrentVehicleInMarketDatabase,
  isReplacementInMarketDatabase,
} from "@/store/market-store";
import { fetchNewVehicleMarket, fetchTradeInMarket } from "@/lib/market/client";
import { buildCurrentVehicleMarketLabel } from "@/lib/market/query-from-case";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { Globe, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MarketPreview {
  tradeValue?: number;
  tradeInCurated?: boolean;
  vehiclePrice?: number;
  replacementCurated?: boolean;
  replacementQuery?: string;
}

export function MarketSyncCard() {
  const pathname = usePathname();
  const input = useCaseStore((s) => s.input);
  const updateCurrent = useCaseStore((s) => s.updateCurrent);
  const updateReplacement = useCaseStore((s) => s.updateReplacement);
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<MarketPreview | null>(null);
  const [marketMeta, setMarketMeta] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const replacementQuery = selected ? getReplacementMarketQuery() : "";
  const replacementInDb = isReplacementInMarketDatabase();
  const tradeInInDb = isCurrentVehicleInMarketDatabase();
  const canFetch =
    Boolean(input.current.manufacturer.trim() && input.current.model.trim()) ||
    Boolean(replacementQuery);

  const autoFetched = useRef(false);

  const runMarketFetch = useCallback(async () => {
    if (!canFetch) {
      setError("Enter your current vehicle and/or add a replacement first.");
      return;
    }

    setLoading(true);
    setError(null);
    setWarnings([]);

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

    const nextPreview: MarketPreview = { replacementQuery };
    const nextWarnings: string[] = [];

    try {
      if (input.current.manufacturer.trim() && input.current.model.trim()) {
        try {
          const tradeRes = await fetchTradeInMarket(tradeInInput);
          nextPreview.tradeValue = tradeRes.result.tradeInValue;
          nextPreview.tradeInCurated = tradeInInDb;
          if (!tradeInInDb) {
            nextWarnings.push(
              `${buildCurrentVehicleMarketLabel(input.current)} is not in our curated used-car list — trade-in is a depreciation estimate (lower confidence).`
            );
          }
        } catch (e) {
          nextWarnings.push(
            e instanceof Error ? e.message : "Could not value current vehicle trade-in."
          );
        }
      }

      if (replacementQuery) {
        try {
          const vehicleRes = await fetchNewVehicleMarket(replacementQuery, selected?.price);
          nextPreview.vehiclePrice = vehicleRes.result.recommendedPurchasePrice;
          nextPreview.replacementCurated = replacementInDb;
          if (!replacementInDb) {
            nextWarnings.push(
              `"${replacementQuery}" is not in our curated new-vehicle list yet — add it via Full mode → SA Market Intelligence.`
            );
          }
        } catch (e) {
          nextWarnings.push(
            e instanceof Error
              ? e.message
              : `Could not find "${replacementQuery}" in the SA market database.`
          );
        }
      }

      if (nextPreview.tradeValue === undefined && nextPreview.vehiclePrice === undefined) {
        setError("No SA market values returned. Try Full mode → SA Market Intelligence for manual search.");
        setPreview(null);
      } else {
        setPreview(nextPreview);
        setMarketMeta(`SA market lookup · ${new Date().toLocaleString()}`);
      }
      setWarnings(nextWarnings);
    } finally {
      setLoading(false);
    }
  }, [canFetch, input, replacementQuery, selected, tradeInInDb, replacementInDb]);

  useEffect(() => {
    if (autoFetched.current) return;
    if (!canFetch || (!replacementInDb && !tradeInInDb)) return;
    autoFetched.current = true;
    void runMarketFetch();
  }, [canFetch, replacementInDb, tradeInInDb, runMarketFetch]);

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
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          <Globe className="h-4 w-4 text-accent" />
          SA Market Values
          {replacementInDb && <Badge variant="success">Replacement in database</Badge>}
          {tradeInInDb && <Badge variant="success">Trade-in in database</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Pull trade-in and replacement prices from our curated South African market dataset
          (AutoTrader, Cars.co.za, OEM &amp; dealer listings). Only listed models return live
          market bands — others show estimates.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => void runMarketFetch()} disabled={loading || !canFetch}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Globe className="mr-2 h-4 w-4" />
            )}
            Fetch market values
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`${pathname}?step=market`}>Open SA Market Intelligence</Link>
          </Button>
        </div>
        {error && (
          <div className="flex gap-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}
        {warnings.length > 0 && (
          <ul className="space-y-1 text-xs text-amber-700 dark:text-amber-400">
            {warnings.map((w) => (
              <li key={w}>• {w}</li>
            ))}
          </ul>
        )}
        {marketMeta && <p className="text-xs text-muted-foreground">{marketMeta}</p>}
        {preview && (
          <div className="space-y-2 rounded-lg border border-border bg-background p-3 text-sm">
            {preview.tradeValue !== undefined && (
              <p>
                Trade-in value{" "}
                {!preview.tradeInCurated && (
                  <span className="text-xs text-muted-foreground">(estimated)</span>
                )}
                :{" "}
                <span className="font-semibold tabular-nums">{formatCurrency(preview.tradeValue)}</span>
              </p>
            )}
            {preview.vehiclePrice !== undefined && (
              <p>
                Replacement price{" "}
                {preview.replacementCurated ? (
                  <span className="text-xs text-muted-foreground">(curated SA market)</span>
                ) : null}
                :{" "}
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
