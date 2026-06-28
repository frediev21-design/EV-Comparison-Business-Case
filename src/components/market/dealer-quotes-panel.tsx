"use client";

import { useMarketStore } from "@/store/market-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { Plus, Trash2 } from "lucide-react";

export function DealerQuotesPanel() {
  const quotes = useMarketStore((s) => s.dealerQuotes);
  const add = useMarketStore((s) => s.addDealerQuote);
  const update = useMarketStore((s) => s.updateDealerQuote);
  const remove = useMarketStore((s) => s.removeDealerQuote);

  const addEmpty = () =>
    add({
      dealerName: `Dealer ${quotes.length + 1}`,
      vehiclePrice: 0,
      accessories: 0,
      financeOffer: "",
      tradeInOffer: 0,
      delivery: 0,
    });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Dealer Quotes</CardTitle>
        <Button size="sm" variant="outline" onClick={addEmpty}>
          <Plus className="mr-1 h-3 w-3" /> Add Dealer
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {quotes.length === 0 && (
          <p className="text-sm text-muted-foreground">Save up to 4 dealer quotes to compare pricing.</p>
        )}
        {quotes.map((q) => {
          const total = q.vehiclePrice + q.accessories + q.delivery - q.tradeInOffer;
          return (
            <div key={q.id} className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <Input
                  value={q.dealerName}
                  onChange={(e) => update(q.id, { dealerName: e.target.value })}
                  className="max-w-xs font-medium"
                />
                <Button variant="ghost" size="icon" onClick={() => remove(q.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {(
                  [
                    ["vehiclePrice", "Vehicle Price"],
                    ["accessories", "Accessories"],
                    ["delivery", "Delivery"],
                    ["tradeInOffer", "Trade-In"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-xs">{label}</Label>
                    <Input
                      type="number"
                      value={q[key]}
                      onChange={(e) => update(q.id, { [key]: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                ))}
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-xs">Finance Offer</Label>
                  <Input
                    value={q.financeOffer}
                    onChange={(e) => update(q.id, { financeOffer: e.target.value })}
                    placeholder="72mo @ 10%"
                  />
                </div>
              </div>
              <p className="mt-3 text-sm font-medium tabular-nums">
                Net price: {formatCurrency(total)}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
