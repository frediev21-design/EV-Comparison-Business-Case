"use client";

import { useCaseStore } from "@/store/case-store";
import { FormField, FormSection } from "./form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/format";
import { Sun, Battery, Car, PiggyBank } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export function SolarStep() {
  const solar = useCaseStore((s) => s.input.solar);
  const solarResult = useCaseStore((s) => s.result.solar);
  const updateSolar = useCaseStore((s) => s.updateSolar);

  const num = (v: string) => parseFloat(v) || 0;

  const handleSolarPercent = (value: number) => {
    updateSolar({ solarChargingPercent: value, gridChargingPercent: 100 - value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Solar Edge</h2>
        <p className="text-sm text-muted-foreground">Model solar contribution to EV charging costs.</p>
      </div>

      <FormSection title="Solar Configuration" description="">
        <FormField label="Solar System Size" type="number" suffix="kW" value={solar.systemSizeKw} onChange={(v) => updateSolar({ systemSizeKw: num(v) })} />
        <FormField label="Battery Size" type="number" suffix="kWh" value={solar.batterySizeKwh} onChange={(v) => updateSolar({ batterySizeKwh: num(v) })} />
        <FormField label="Electricity Tariff" type="number" prefix="R" suffix="/kWh" value={solar.electricityTariff} onChange={(v) => updateSolar({ electricityTariff: num(v) })} step={0.01} />
        <FormField label="Peak Tariff" type="number" prefix="R" suffix="/kWh" value={solar.peakTariff} onChange={(v) => updateSolar({ peakTariff: num(v) })} step={0.01} />
        <FormField label="Off-Peak Tariff" type="number" prefix="R" suffix="/kWh" value={solar.offPeakTariff} onChange={(v) => updateSolar({ offPeakTariff: num(v) })} step={0.01} />
      </FormSection>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex justify-between">
            <Label>Solar Charging %</Label>
            <span className="text-sm font-medium">{solar.solarChargingPercent}% solar / {solar.gridChargingPercent}% grid</span>
          </div>
          <Slider
            value={[solar.solarChargingPercent]}
            min={0}
            max={100}
            step={5}
            onValueChange={([v]) => handleSolarPercent(v)}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Sun, label: "Solar Panels", value: `${solarResult.visual.solarPanels} kW`, color: "text-warning" },
          { icon: Battery, label: "Battery", value: `${solarResult.visual.battery} kWh`, color: "text-accent" },
          { icon: Car, label: "Annual Energy", value: `${formatNumber(solarResult.visual.vehicle, 0)} kWh`, color: "text-primary" },
          { icon: PiggyBank, label: "Money Saved", value: formatCurrency(solarResult.visual.moneySaved), color: "text-success" },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label}>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <Icon className={`mb-3 h-8 w-8 ${color}`} />
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-lg font-bold tabular-nums">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Grid kWh Purchased", value: formatNumber(solarResult.gridKwhPurchased, 0) + " kWh" },
          { label: "Solar Contribution", value: formatNumber(solarResult.solarContributionKwh, 0) + " kWh" },
          { label: "Annual Charging Cost", value: formatCurrency(solarResult.annualChargingCost) },
          { label: "10-Year Charging Cost", value: formatCurrency(solarResult.tenYearChargingCost) },
          { label: "Fuel Savings vs Baseline", value: formatCurrency(solarResult.fuelSavingsVsBaseline) },
          { label: "Solar Contribution %", value: `${formatNumber(solarResult.solarContributionPercent, 1)}%` },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold tabular-nums">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
