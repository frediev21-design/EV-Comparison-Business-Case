"use client";

import { useMemo } from "react";
import { useCaseStore } from "@/store/case-store";
import { getCaseValidationMessages } from "@/lib/wizard-validation";
import { buildCurrentMonthlyFromInputs } from "@/lib/current-monthly-breakdown";
import { ValidationAlerts } from "./validation-alerts";
import { FormField, FormSelect, FormSection, FormSliderField } from "./form-field";
import { parseLocaleNumber } from "@/lib/parse-number";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

const FUEL_OPTIONS = [
  { value: "diesel", label: "Diesel" },
  { value: "petrol", label: "Petrol" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
  { value: "phev", label: "PHEV" },
];

export function CurrentVehicleStep() {
  const current = useCaseStore((s) => s.input.current);
  const input = useCaseStore((s) => s.input);
  const result = useCaseStore((s) => s.result);
  const updateCurrent = useCaseStore((s) => s.updateCurrent);
  const updateAssumptions = useCaseStore((s) => s.updateAssumptions);
  const assumptions = input.assumptions;
  const validationMessages = getCaseValidationMessages(input, result);
  const monthlyPreview = useMemo(() => buildCurrentMonthlyFromInputs(input), [input]);

  const num = (v: string) => parseLocaleNumber(v);
  const int = (v: string) => parseInt(v, 10) || 0;

  return (
    <div className="space-y-8">
      <ValidationAlerts messages={validationMessages} step="current" />
      <FormSection
        title="Vehicle essentials"
        description="Required to continue — loan repayment, fuel use, and daily distance."
      >
        <FormField label="Manufacturer" value={current.manufacturer} onChange={(v) => updateCurrent({ manufacturer: v })} />
        <FormField label="Model" value={current.model} onChange={(v) => updateCurrent({ model: v })} />
        <FormField label="Year" type="number" value={current.year} onChange={(v) => updateCurrent({ year: int(v) })} />
        <FormField label="Current Value" type="number" prefix="R" value={current.currentValue} onChange={(v) => updateCurrent({ currentValue: num(v), tradeInValue: num(v) })} />
        <FormField label="Outstanding Finance" type="number" prefix="R" value={current.outstandingFinance} onChange={(v) => updateCurrent({ outstandingFinance: num(v) })} />
        <FormField
          label="Current monthly repayment"
          type="number"
          prefix="R"
          value={current.monthlyInstalment}
          onChange={(v) => updateCurrent({ monthlyInstalment: num(v) })}
          hint="What you pay on your vehicle loan each month — not fuel, insurance, or maintenance."
        />
        <FormSelect label="Fuel Type" value={current.fuelType} options={FUEL_OPTIONS} onChange={(v) => updateCurrent({ fuelType: v as typeof current.fuelType })} />
        <FormSliderField
          label="Fuel consumption"
          value={current.fuelConsumption}
          onChange={(v) => updateCurrent({ fuelConsumption: v })}
          min={4}
          max={20}
          step={0.5}
          suffix="L/100km"
          displayDecimals={1}
        />
        <FormSliderField
          label="Daily distance"
          value={assumptions.dailyDistanceKm}
          onChange={(v) => updateAssumptions({ dailyDistanceKm: v })}
          min={10}
          max={300}
          step={5}
          suffix="km/day"
        />
      </FormSection>

      <FormSection title="Additional details" description="Optional — improves accuracy of running costs and trade-in.">
        <FormField label="Mileage (km)" type="number" value={current.mileage} onChange={(v) => updateCurrent({ mileage: num(v) })} />
        <FormSliderField
          label="Fuel price"
          value={assumptions.fuelPricePerLitre}
          onChange={(v) => updateAssumptions({ fuelPricePerLitre: v })}
          min={15}
          max={35}
          step={0.5}
          prefix="R"
          suffix="/L"
          displayDecimals={2}
        />
        <FormSliderField
          label="Fleet size"
          value={assumptions.fleetVehicleCount}
          onChange={(v) => updateAssumptions({ fleetVehicleCount: Math.max(1, Math.round(v)) })}
          min={1}
          max={20}
          step={1}
          suffix="vehicles"
        />
        <FormField label="Insurance (annual)" type="number" prefix="R" value={current.insurance} onChange={(v) => updateCurrent({ insurance: num(v) })} />
        <FormField label="Maintenance (annual)" type="number" prefix="R" value={current.maintenance} onChange={(v) => updateCurrent({ maintenance: num(v) })} />
        <FormField label="Tyres (annual)" type="number" prefix="R" value={current.tyres} onChange={(v) => updateCurrent({ tyres: num(v) })} />
        <FormField label="Licence (annual)" type="number" prefix="R" value={current.licence} onChange={(v) => updateCurrent({ licence: num(v) })} />
        <FormField label="Expected Annual Repairs" type="number" prefix="R" value={current.expectedAnnualRepairs} onChange={(v) => updateCurrent({ expectedAnnualRepairs: num(v) })} />
        <FormField label="Residual Value" type="number" prefix="R" value={current.residualValue} onChange={(v) => updateCurrent({ residualValue: num(v) })} />
      </FormSection>

      <Card className="border-accent/20 bg-accent/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Your current monthly repayment</CardTitle>
          <p className="text-xs text-muted-foreground">
            Based on the loan repayment you entered above — finance only.
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold tabular-nums tracking-tight">
            {formatCurrency(monthlyPreview.instalment)}
            <span className="text-lg font-normal text-muted-foreground">/month</span>
          </p>
          {monthlyPreview.instalmentAdjusted && (
            <p className="mt-2 text-xs text-warning">
              Adjusted from {formatCurrency(monthlyPreview.enteredInstalment)}/mo — entered amount
              looks like total vehicle cost, not loan repayment only.
            </p>
          )}
          {current.outstandingFinance > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Outstanding finance: {formatCurrency(current.outstandingFinance)}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Full monthly cost (repayment + running costs)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Current repayment</span>
            <span className="font-medium tabular-nums">{formatCurrency(monthlyPreview.instalment)}</span>
          </div>
          {monthlyPreview.lines.map((line) => (
            <div key={line.label} className="flex justify-between gap-4">
              <span className="text-muted-foreground">{line.label}</span>
              <span className="tabular-nums">{formatCurrency(line.monthly)}</span>
            </div>
          ))}
          <div className="flex justify-between gap-4 border-t border-border pt-3 font-semibold">
            <span>Total monthly cost</span>
            <span className="tabular-nums text-accent">{formatCurrency(monthlyPreview.totalMonthly)}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vehicle Flags</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {[
            { key: "hasTurbo" as const, label: "Turbo" },
            { key: "hasDpf" as const, label: "DPF" },
            { key: "warrantyExpired" as const, label: "Warranty Expired" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={current[key]}
                onChange={(e) => updateCurrent({ [key]: e.target.checked })}
                className="rounded border-border"
              />
              {label}
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
