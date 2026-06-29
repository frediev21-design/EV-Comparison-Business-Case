"use client";

import { useCaseStore } from "@/store/case-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { FormSliderField } from "@/components/wizard/form-field";
import { SavingsBreakdownCard } from "@/components/dashboard/savings-breakdown-card";
import { WHAT_IF_PRESETS } from "@/lib/what-if-presets";
import { Badge } from "@/components/ui/badge";

export function WhatIfPanel() {
  const input = useCaseStore((s) => s.input);
  const whatIf = input.whatIf ?? {};
  const updateWhatIf = useCaseStore((s) => s.updateWhatIf);
  const resetWhatIf = useCaseStore((s) => s.resetWhatIf);
  const kpis = useCaseStore((s) => s.result.kpis);

  const dailyDistance = whatIf.dailyDistanceKm ?? input.assumptions.dailyDistanceKm;
  const fuelPrice = whatIf.fuelPricePerLitre ?? input.assumptions.fuelPricePerLitre;
  const electricityTariff = whatIf.electricityTariff ?? input.assumptions.electricityTariff;
  const interestRate =
    whatIf.interestRate ??
    input.replacements.find((v) => v.id === input.selectedReplacementId)?.interestRate ??
    10;
  const solarPercent = whatIf.solarPercent ?? input.solar.solarChargingPercent;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">What-If Analysis</h2>
          <p className="text-sm text-muted-foreground">Adjust assumptions and see instant impact on KPIs. Edit trade value and outstanding finance on the Current Vehicle and Trade-In steps.</p>
        </div>
        <Button variant="outline" size="sm" onClick={resetWhatIf}>
          Reset All
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Indicative Monthly Cash Flow</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold tabular-nums text-accent">{formatCurrency(kpis.monthlySaving)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">10-Year Net TCO Delta</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold tabular-nums">{formatCurrency(kpis.tenYearSaving)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Indicative Payback</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold tabular-nums">{kpis.paybackMonths > 0 ? `${kpis.paybackMonths} mo` : "N/A"}</p></CardContent>
        </Card>
      </div>

      <SavingsBreakdownCard />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Assumption Presets</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {WHAT_IF_PRESETS.map((preset) => (
            <button key={preset.id} type="button" onClick={() => {
              if (preset.id === "baseline") resetWhatIf();
              else updateWhatIf(preset.overrides);
            }}>
              <Badge variant="outline" title={preset.description}>{preset.label}</Badge>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
          <FormSliderField
            label="Daily distance"
            value={dailyDistance}
            onChange={(v) => updateWhatIf({ dailyDistanceKm: v })}
            min={10}
            max={300}
            step={5}
            suffix="km/day"
          />
          <FormSliderField
            label="Fuel price"
            value={fuelPrice}
            onChange={(v) => updateWhatIf({ fuelPricePerLitre: v })}
            min={15}
            max={35}
            step={0.5}
            prefix="R"
            suffix="/L"
            displayDecimals={2}
          />
          <FormSliderField
            label="Electricity price"
            value={electricityTariff}
            onChange={(v) => updateWhatIf({ electricityTariff: v })}
            min={1}
            max={6}
            step={0.05}
            prefix="R"
            suffix="/kWh"
            displayDecimals={2}
          />
          <FormSliderField
            label="Interest rate"
            value={interestRate}
            onChange={(v) => updateWhatIf({ interestRate: v })}
            min={3}
            max={18}
            step={0.1}
            suffix="%"
            displayDecimals={1}
          />
          <FormSliderField
            label="Solar charging"
            value={solarPercent}
            onChange={(v) => updateWhatIf({ solarPercent: v, gridPercent: 100 - v })}
            min={0}
            max={100}
            step={5}
            suffix="%"
          />
          <FormSliderField
            label="Current maintenance (annual)"
            value={whatIf.maintenance ?? input.current.maintenance}
            onChange={(v) => updateWhatIf({ maintenance: v })}
            min={0}
            max={50000}
            step={500}
            prefix="R"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Monthly Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="font-medium">Current vehicle</p>
            <p className="text-muted-foreground">Current repayment: {formatCurrency(kpis.currentFinanceInstalment)}</p>
            <p className="text-muted-foreground">Running: {formatCurrency(kpis.currentRunningMonthly)}</p>
            <p className="font-semibold tabular-nums">Total: {formatCurrency(kpis.currentMonthlyCost)}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="font-medium">Replacement vehicle</p>
            <p className="text-muted-foreground">Replacement repayment: {formatCurrency(kpis.replacementFinanceInstalment)}</p>
            <p className="text-muted-foreground">Running: {formatCurrency(kpis.replacementRunningMonthly)}</p>
            <p className="font-semibold tabular-nums">Total: {formatCurrency(kpis.replacementMonthlyCost)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
