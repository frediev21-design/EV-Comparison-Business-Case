"use client";

import { useCaseStore } from "@/store/case-store";
import { VEHICLE_PRESETS } from "@/store/defaults";
import { FormField, FormSelect, FormSection } from "./form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const FUEL_OPTIONS = [
  { value: "diesel", label: "Diesel" },
  { value: "petrol", label: "Petrol" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
  { value: "phev", label: "PHEV" },
];

export function ReplacementVehiclesStep() {
  const replacements = useCaseStore((s) => s.input.replacements);
  const selectedId = useCaseStore((s) => s.input.selectedReplacementId);
  const additionalCashDeposit = useCaseStore((s) => s.input.tradeIn?.additionalCashDeposit ?? 0);
  const addReplacement = useCaseStore((s) => s.addReplacement);
  const updateReplacement = useCaseStore((s) => s.updateReplacement);
  const updateTradeIn = useCaseStore((s) => s.updateTradeIn);
  const removeReplacement = useCaseStore((s) => s.removeReplacement);
  const selectReplacement = useCaseStore((s) => s.selectReplacement);

  const num = (v: string) => parseFloat(v) || 0;
  const int = (v: string) => parseInt(v, 10) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Replacement Vehicles</h2>
        <p className="text-sm text-muted-foreground">Compare unlimited replacement options side by side.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {VEHICLE_PRESETS.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => addReplacement(preset)}
          >
            <Plus className="mr-1 h-3 w-3" />
            {preset.name}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {replacements.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => selectReplacement(v.id)}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm transition-colors",
              selectedId === v.id
                ? "border-accent bg-accent/10 font-medium text-accent"
                : "border-border hover:bg-muted"
            )}
          >
            {v.name}
          </button>
        ))}
      </div>

      {replacements.map((vehicle) => (
        <Card key={vehicle.id} className={cn(selectedId !== vehicle.id && "opacity-60")}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{vehicle.name}</CardTitle>
              {selectedId === vehicle.id && <Badge variant="success">Selected</Badge>}
            </div>
            {replacements.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => removeReplacement(vehicle.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <FormSection title="" description="">
              <FormField label="Vehicle Name" value={vehicle.name} onChange={(v) => updateReplacement(vehicle.id, { name: v })} />
              <FormField label="Price" type="number" prefix="R" value={vehicle.price} onChange={(v) => updateReplacement(vehicle.id, { price: num(v) })} />
              {selectedId === vehicle.id && (
                <FormField
                  label="Cash Deposit"
                  type="number"
                  prefix="R"
                  value={additionalCashDeposit}
                  onChange={(v) => updateTradeIn({ additionalCashDeposit: num(v) })}
                  hint="Extra cash on top of trade equity — also editable on the Trade-In step."
                />
              )}
              <FormField label="Interest Rate" type="number" suffix="%" value={vehicle.interestRate} onChange={(v) => updateReplacement(vehicle.id, { interestRate: num(v) })} min={3} max={18} step={0.1} />
              <FormField label="Finance Term" type="number" suffix="months" value={vehicle.financeTermMonths} onChange={(v) => updateReplacement(vehicle.id, { financeTermMonths: int(v) })} min={12} max={96} />
              <FormSelect label="Fuel Type" value={vehicle.fuelType} options={FUEL_OPTIONS} onChange={(v) => updateReplacement(vehicle.id, { fuelType: v as typeof vehicle.fuelType })} />
              <FormField label="Battery Size" type="number" suffix="kWh" value={vehicle.batterySizeKwh} onChange={(v) => updateReplacement(vehicle.id, { batterySizeKwh: num(v) })} />
              <FormField label="Fuel Consumption" type="number" suffix="L/100km" value={vehicle.fuelConsumption} onChange={(v) => updateReplacement(vehicle.id, { fuelConsumption: num(v) })} step={0.1} />
              <FormField label="Energy Consumption" type="number" suffix="kWh/100km" value={vehicle.energyConsumption} onChange={(v) => updateReplacement(vehicle.id, { energyConsumption: num(v) })} step={0.1} />
              <FormField label="Warranty" type="number" suffix="years" value={vehicle.warrantyYears} onChange={(v) => updateReplacement(vehicle.id, { warrantyYears: int(v) })} />
              <FormField label="Battery Warranty" type="number" suffix="years" value={vehicle.batteryWarrantyYears} onChange={(v) => updateReplacement(vehicle.id, { batteryWarrantyYears: int(v) })} />
              <FormField label="Maintenance (annual)" type="number" prefix="R" value={vehicle.maintenance} onChange={(v) => updateReplacement(vehicle.id, { maintenance: num(v) })} />
              <FormField label="Insurance (annual)" type="number" prefix="R" value={vehicle.insurance} onChange={(v) => updateReplacement(vehicle.id, { insurance: num(v) })} />
              <FormField label="Expected Resale" type="number" prefix="R" value={vehicle.expectedResale} onChange={(v) => updateReplacement(vehicle.id, { expectedResale: num(v) })} />
            </FormSection>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
