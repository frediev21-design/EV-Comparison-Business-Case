"use client";

import { useCaseStore } from "@/store/case-store";
import { FormField, FormSection, FormSliderField } from "./form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/format";
import { estimateSolarSystemCost } from "@/engine/solar";
import { parseLocaleNumber } from "@/lib/parse-number";
import { NPV_SOLAR_SUMMARY_LABEL } from "@/lib/npv-explainer";
import { Sun, Battery, Car, PiggyBank } from "lucide-react";

export function SolarStep() {
  const solar = useCaseStore((s) => s.input.solar);
  const assumptions = useCaseStore((s) => s.input.assumptions);
  const solarResult = useCaseStore((s) => s.result.solar);
  const updateSolar = useCaseStore((s) => s.updateSolar);

  const num = (v: string) => parseLocaleNumber(v);
  const estimatedSystemCost = estimateSolarSystemCost(solar);

  const handleSolarPercent = (value: number) => {
    updateSolar({ solarChargingPercent: value, gridChargingPercent: 100 - value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Solar Edge</h2>
        <p className="text-sm text-muted-foreground">
          Model solar contribution with amortised system cost and peak/off-peak grid tariffs.
        </p>
      </div>

      <FormSection title="Solar configuration" description="">
        <FormSliderField
          label="Solar system size"
          value={solar.systemSizeKw}
          onChange={(v) => updateSolar({ systemSizeKw: v })}
          min={0}
          max={20}
          step={0.5}
          suffix="kW"
          displayDecimals={1}
        />
        <FormSliderField
          label="Battery size"
          value={solar.batterySizeKwh}
          onChange={(v) => updateSolar({ batterySizeKwh: v })}
          min={0}
          max={30}
          step={0.5}
          suffix="kWh"
          displayDecimals={1}
        />
        <FormField
          label="Installed system cost"
          type="number"
          prefix="R"
          value={solar.systemCost}
          onChange={(v) => updateSolar({ systemCost: num(v) })}
          hint={solar.systemCost <= 0 && solar.systemSizeKw > 0 ? `Auto-estimate: ${formatCurrency(estimatedSystemCost)}` : undefined}
        />
        <FormSliderField
          label="Amortisation period"
          value={solar.amortisationYears}
          onChange={(v) => updateSolar({ amortisationYears: Math.max(1, Math.round(v)) })}
          min={1}
          max={25}
          step={1}
          suffix="years"
        />
        <FormSliderField
          label="Grid peak share"
          value={solar.gridPeakPercent}
          onChange={(v) => updateSolar({ gridPeakPercent: v })}
          min={0}
          max={100}
          step={5}
          suffix="%"
          hint="Share of grid kWh at peak tariff; remainder at off-peak."
        />
        <FormSliderField
          label="Solar charging"
          value={solar.solarChargingPercent}
          onChange={handleSolarPercent}
          min={0}
          max={100}
          step={5}
          suffix="% solar"
          hint={`${solar.gridChargingPercent}% from grid`}
        />
        <FormSliderField
          label="Electricity tariff (fallback)"
          value={solar.electricityTariff}
          onChange={(v) => updateSolar({ electricityTariff: v })}
          min={1}
          max={6}
          step={0.05}
          prefix="R"
          suffix="/kWh"
          displayDecimals={2}
        />
        <FormSliderField
          label="Peak tariff"
          value={solar.peakTariff}
          onChange={(v) => updateSolar({ peakTariff: v })}
          min={1}
          max={8}
          step={0.05}
          prefix="R"
          suffix="/kWh"
          displayDecimals={2}
        />
        <FormSliderField
          label="Off-peak tariff"
          value={solar.offPeakTariff}
          onChange={(v) => updateSolar({ offPeakTariff: v })}
          min={0.5}
          max={4}
          step={0.05}
          prefix="R"
          suffix="/kWh"
          displayDecimals={2}
        />
      </FormSection>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Sun, label: "Solar panels", value: `${solarResult.visual.solarPanels} kW`, color: "text-warning" },
          { icon: Battery, label: "Battery", value: `${solarResult.visual.battery} kWh`, color: "text-accent" },
          { icon: Car, label: "Annual energy", value: `${formatNumber(solarResult.visual.vehicle, 0)} kWh`, color: "text-primary" },
          { icon: PiggyBank, label: "Fuel savings vs diesel", value: formatCurrency(solarResult.visual.moneySaved), color: "text-success" },
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
          { label: "Grid kWh purchased", value: formatNumber(solarResult.gridKwhPurchased, 0) + " kWh" },
          { label: "Solar kWh (home)", value: formatNumber(solarResult.solarContributionKwh, 0) + " kWh" },
          { label: "Annual charging cost", value: formatCurrency(solarResult.annualChargingCost) },
          { label: "Solar amortisation / yr", value: formatCurrency(solarResult.annualSolarAmortisation) },
          { label: "10-year charging cost", value: formatCurrency(solarResult.tenYearChargingCost) },
          { label: NPV_SOLAR_SUMMARY_LABEL, value: `${assumptions.discountRate ?? 10.5}%` },
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
