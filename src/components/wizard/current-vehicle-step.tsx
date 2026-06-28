"use client";

import { useCaseStore } from "@/store/case-store";
import { FormField, FormSelect, FormSection } from "./form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FUEL_OPTIONS = [
  { value: "diesel", label: "Diesel" },
  { value: "petrol", label: "Petrol" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
  { value: "phev", label: "PHEV" },
];

export function CurrentVehicleStep() {
  const current = useCaseStore((s) => s.input.current);
  const updateCurrent = useCaseStore((s) => s.updateCurrent);
  const updateAssumptions = useCaseStore((s) => s.updateAssumptions);
  const dailyDistance = useCaseStore((s) => s.input.assumptions.dailyDistanceKm);

  const num = (v: string) => parseFloat(v) || 0;
  const int = (v: string) => parseInt(v, 10) || 0;

  return (
    <div className="space-y-8">
      <FormSection title="Current Vehicle" description="Capture your existing vehicle details and operating assumptions.">
        <FormField label="Manufacturer" value={current.manufacturer} onChange={(v) => updateCurrent({ manufacturer: v })} />
        <FormField label="Model" value={current.model} onChange={(v) => updateCurrent({ model: v })} />
        <FormField label="Year" type="number" value={current.year} onChange={(v) => updateCurrent({ year: int(v) })} />
        <FormField label="Mileage (km)" type="number" value={current.mileage} onChange={(v) => updateCurrent({ mileage: num(v) })} />
        <FormField label="Current Value" type="number" prefix="R" value={current.currentValue} onChange={(v) => updateCurrent({ currentValue: num(v) })} />
        <FormField label="Outstanding Finance" type="number" prefix="R" value={current.outstandingFinance} onChange={(v) => updateCurrent({ outstandingFinance: num(v) })} />
        <FormField
          label="Monthly Loan Instalment"
          type="number"
          prefix="R"
          value={current.monthlyInstalment}
          onChange={(v) => updateCurrent({ monthlyInstalment: num(v) })}
        />
        <FormSelect label="Fuel Type" value={current.fuelType} options={FUEL_OPTIONS} onChange={(v) => updateCurrent({ fuelType: v as typeof current.fuelType })} />
        <FormField label="Fuel Consumption" type="number" suffix="L/100km" value={current.fuelConsumption} onChange={(v) => updateCurrent({ fuelConsumption: num(v) })} step={0.1} />
        <FormField label="Insurance (annual)" type="number" prefix="R" value={current.insurance} onChange={(v) => updateCurrent({ insurance: num(v) })} />
        <FormField label="Maintenance (annual)" type="number" prefix="R" value={current.maintenance} onChange={(v) => updateCurrent({ maintenance: num(v) })} />
        <FormField label="Tyres (annual)" type="number" prefix="R" value={current.tyres} onChange={(v) => updateCurrent({ tyres: num(v) })} />
        <FormField label="Licence (annual)" type="number" prefix="R" value={current.licence} onChange={(v) => updateCurrent({ licence: num(v) })} />
        <FormField label="Expected Annual Repairs" type="number" prefix="R" value={current.expectedAnnualRepairs} onChange={(v) => updateCurrent({ expectedAnnualRepairs: num(v) })} />
        <FormField label="Trade-In Value" type="number" prefix="R" value={current.tradeInValue} onChange={(v) => updateCurrent({ tradeInValue: num(v) })} />
        <FormField label="Residual Value" type="number" prefix="R" value={current.residualValue} onChange={(v) => updateCurrent({ residualValue: num(v) })} />
        <FormField label="Daily Distance" type="number" suffix="km/day" value={dailyDistance} onChange={(v) => updateAssumptions({ dailyDistanceKm: num(v) })} min={10} max={300} />
      </FormSection>
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
