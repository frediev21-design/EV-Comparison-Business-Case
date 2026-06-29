"use client";

import { useDealer, DEALER_PROFILES } from "@/components/dealer/dealer-provider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Store } from "lucide-react";

export function DealerSettings({ compact = false }: { compact?: boolean }) {
  const { settings, profile, setDealerId, setConsultantName } = useDealer();

  return (
    <div className={compact ? "space-y-2" : "space-y-4 rounded-xl border border-border p-4"}>
      {!compact && (
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium">Dealer profile</p>
        </div>
      )}
      <div className="space-y-1.5">
        {compact && (
          <Label htmlFor="dealer-profile" className="text-[11px] text-muted-foreground">
            Dealer profile
          </Label>
        )}
        <select
          id="dealer-profile"
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            compact && "h-8 text-xs"
          )}
          value={settings.dealerId ?? "default"}
          onChange={(e) => setDealerId(e.target.value === "default" ? null : e.target.value)}
        >
          <option value="default">All models (default)</option>
          {DEALER_PROFILES.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        {profile && (
          <p className="text-[11px] leading-snug text-muted-foreground">
            {profile.tagline} · {profile.brands.join(", ")}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label
          htmlFor="consultant-name"
          className={compact ? "text-[11px] text-muted-foreground" : undefined}
        >
          Consultant name
        </Label>
        <Input
          id="consultant-name"
          className={compact ? "h-8 text-xs" : undefined}
          placeholder="For PDF exports"
          value={settings.consultantName}
          onChange={(e) => setConsultantName(e.target.value)}
        />
      </div>
    </div>
  );
}
