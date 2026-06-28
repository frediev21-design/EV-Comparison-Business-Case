"use client";

import { useCaseStore } from "@/store/case-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

function WhatIfSlider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Label>{label}</Label>
        <span className="text-sm font-medium tabular-nums">{format(value)}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}

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
          <p className="text-sm text-muted-foreground">Adjust assumptions and see instant impact on KPIs.</p>
        </div>
        <Button variant="outline" size="sm" onClick={resetWhatIf}>
          Reset All
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Monthly Saving</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold tabular-nums text-accent">{formatCurrency(kpis.monthlySaving)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">10-Year Saving</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold tabular-nums">{formatCurrency(kpis.tenYearSaving)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Payback</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold tabular-nums">{kpis.paybackMonths > 0 ? `${kpis.paybackMonths} mo` : "N/A"}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
          <WhatIfSlider label="Daily Distance" value={dailyDistance} min={10} max={300} step={5} format={(v) => `${v} km/day`} onChange={(v) => updateWhatIf({ dailyDistanceKm: v })} />
          <WhatIfSlider label="Fuel Price" value={fuelPrice} min={15} max={35} step={0.5} format={(v) => `R${v.toFixed(2)}/L`} onChange={(v) => updateWhatIf({ fuelPricePerLitre: v })} />
          <WhatIfSlider label="Electricity Price" value={electricityTariff} min={1} max={6} step={0.05} format={(v) => `R${v.toFixed(2)}/kWh`} onChange={(v) => updateWhatIf({ electricityTariff: v })} />
          <WhatIfSlider label="Interest Rate" value={interestRate} min={3} max={18} step={0.1} format={(v) => `${v.toFixed(1)}%`} onChange={(v) => updateWhatIf({ interestRate: v })} />
          <WhatIfSlider label="Trade Value" value={whatIf.tradeValue ?? input.current.currentValue} min={100000} max={1500000} step={10000} format={formatCurrency} onChange={(v) => updateWhatIf({ tradeValue: v })} />
          <WhatIfSlider label="Outstanding Finance" value={whatIf.outstandingFinance ?? input.current.outstandingFinance} min={0} max={800000} step={5000} format={formatCurrency} onChange={(v) => updateWhatIf({ outstandingFinance: v })} />
          <WhatIfSlider label="Solar %" value={solarPercent} min={0} max={100} step={5} format={(v) => `${v}%`} onChange={(v) => updateWhatIf({ solarPercent: v, gridPercent: 100 - v })} />
          <WhatIfSlider label="Maintenance" value={whatIf.maintenance ?? input.current.maintenance} min={0} max={50000} step={500} format={formatCurrency} onChange={(v) => updateWhatIf({ maintenance: v })} />
        </CardContent>
      </Card>
    </div>
  );
}
