"use client";

import { useMemo } from "react";
import { useCaseStore } from "@/store/case-store";
import { getCaseValidationMessages } from "@/lib/wizard-validation";
import { buildCurrentMonthlyFromInputs } from "@/lib/current-monthly-breakdown";
import { ValidationAlerts } from "./validation-alerts";
import { FormField, FormSelect } from "./form-field";
import { VEHICLE_PRESETS } from "@/store/defaults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowRight, Car, Plus, Sparkles } from "lucide-react";

const FUEL_OPTIONS = [
  { value: "diesel", label: "Diesel" },
  { value: "petrol", label: "Petrol" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
  { value: "phev", label: "PHEV" },
];

function ExpandableSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group rounded-lg border border-border bg-muted/20"
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="text-muted-foreground group-open:text-foreground">{title}</span>
      </summary>
      <div className="grid gap-4 border-t border-border px-4 pb-4 pt-3 sm:grid-cols-2">
        {children}
      </div>
    </details>
  );
}

function ComparisonStrip({
  currentLabel,
  currentRepayment,
  replacementLabel,
  replacementRepayment,
}: {
  currentLabel: string;
  currentRepayment: number;
  replacementLabel: string;
  replacementRepayment: number;
}) {
  return (
    <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Current repayment
        </p>
        <p className="text-lg font-bold tabular-nums">{formatCurrency(currentRepayment)}/mo</p>
        <p className="truncate text-xs text-muted-foreground">{currentLabel}</p>
      </div>
      <ArrowRight className="mx-auto hidden h-5 w-5 text-muted-foreground sm:block" />
      <div className="sm:text-right">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Replacement repayment
        </p>
        <p className="text-lg font-bold tabular-nums text-accent">
          {formatCurrency(replacementRepayment)}/mo
        </p>
        <p className="truncate text-xs text-muted-foreground">{replacementLabel}</p>
      </div>
    </div>
  );
}

export function VehiclesComparisonStep() {
  const input = useCaseStore((s) => s.input);
  const result = useCaseStore((s) => s.result);
  const current = input.current;
  const assumptions = input.assumptions;
  const replacements = input.replacements;
  const selectedId = input.selectedReplacementId;
  const selected = replacements.find((v) => v.id === selectedId);
  const additionalCashDeposit = input.tradeIn?.additionalCashDeposit ?? 0;

  const updateCurrent = useCaseStore((s) => s.updateCurrent);
  const updateAssumptions = useCaseStore((s) => s.updateAssumptions);
  const updateReplacement = useCaseStore((s) => s.updateReplacement);
  const updateTradeIn = useCaseStore((s) => s.updateTradeIn);
  const addReplacement = useCaseStore((s) => s.addReplacement);
  const selectReplacement = useCaseStore((s) => s.selectReplacement);

  const validationMessages = getCaseValidationMessages(input, result);
  const monthlyPreview = useMemo(() => buildCurrentMonthlyFromInputs(input), [input]);

  const num = (v: string) => parseFloat(v) || 0;
  const int = (v: string) => parseInt(v, 10) || 0;

  const currentLabel =
    `${current.manufacturer} ${current.model}`.trim() || "Current vehicle";
  const replacementLabel = selected?.name ?? "Select a replacement";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Your vehicles</h2>
        <p className="text-sm text-muted-foreground">
          Enter your current vehicle and replacement side by side — essentials first, expand for
          full details.
        </p>
      </div>

      <ValidationAlerts messages={validationMessages} step="vehicles" />

      <ComparisonStrip
        currentLabel={currentLabel}
        currentRepayment={result.kpis.currentFinanceInstalment}
        replacementLabel={replacementLabel}
        replacementRepayment={result.kpis.replacementFinanceInstalment}
      />

      <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
        {/* Current vehicle column */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                <Car className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base">Current vehicle</CardTitle>
                <p className="text-xs text-muted-foreground">What you drive today</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Manufacturer"
                value={current.manufacturer}
                onChange={(v) => updateCurrent({ manufacturer: v })}
              />
              <FormField
                label="Model"
                value={current.model}
                onChange={(v) => updateCurrent({ model: v })}
              />
              <FormField
                label="Year"
                type="number"
                value={current.year}
                onChange={(v) => updateCurrent({ year: int(v) })}
              />
              <FormField
                label="Mileage (km)"
                type="number"
                value={current.mileage}
                onChange={(v) => updateCurrent({ mileage: num(v) })}
              />
              <FormField
                label="Current value"
                type="number"
                prefix="R"
                value={current.currentValue}
                onChange={(v) => updateCurrent({ currentValue: num(v), tradeInValue: num(v) })}
              />
              <FormField
                label="Outstanding finance"
                type="number"
                prefix="R"
                value={current.outstandingFinance}
                onChange={(v) => updateCurrent({ outstandingFinance: num(v) })}
              />
              <FormField
                label="Current monthly repayment"
                type="number"
                prefix="R"
                value={current.monthlyInstalment}
                onChange={(v) => updateCurrent({ monthlyInstalment: num(v) })}
                hint="Loan payment only — not fuel or maintenance."
                className="sm:col-span-2"
              />
              <FormSelect
                label="Fuel type"
                value={current.fuelType}
                options={FUEL_OPTIONS}
                onChange={(v) => updateCurrent({ fuelType: v as typeof current.fuelType })}
              />
              <FormField
                label="Fuel consumption"
                type="number"
                suffix="L/100km"
                value={current.fuelConsumption}
                onChange={(v) => updateCurrent({ fuelConsumption: num(v) })}
                step={0.1}
              />
              <FormField
                label="Daily distance"
                type="number"
                suffix="km/day"
                value={assumptions.dailyDistanceKm}
                onChange={(v) => updateAssumptions({ dailyDistanceKm: num(v) })}
                min={10}
                max={300}
              />
              <FormField
                label="Fuel price"
                type="number"
                prefix="R"
                suffix="/L"
                value={assumptions.fuelPricePerLitre}
                onChange={(v) => updateAssumptions({ fuelPricePerLitre: num(v) })}
                step={0.1}
              />
            </div>

            <div className="rounded-lg border border-accent/20 bg-accent/5 px-4 py-3">
              <p className="text-xs text-muted-foreground">Your current repayment</p>
              <p className="text-2xl font-bold tabular-nums">
                {formatCurrency(monthlyPreview.instalment)}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              {monthlyPreview.instalmentAdjusted && (
                <p className="mt-1 text-xs text-warning">
                  Adjusted from {formatCurrency(monthlyPreview.enteredInstalment)}/mo
                </p>
              )}
            </div>

            <ExpandableSection title="Running costs & trade-in details">
              <FormField
                label="Insurance (annual)"
                type="number"
                prefix="R"
                value={current.insurance}
                onChange={(v) => updateCurrent({ insurance: num(v) })}
              />
              <FormField
                label="Maintenance (annual)"
                type="number"
                prefix="R"
                value={current.maintenance}
                onChange={(v) => updateCurrent({ maintenance: num(v) })}
              />
              <FormField
                label="Tyres (annual)"
                type="number"
                prefix="R"
                value={current.tyres}
                onChange={(v) => updateCurrent({ tyres: num(v) })}
              />
              <FormField
                label="Licence (annual)"
                type="number"
                prefix="R"
                value={current.licence}
                onChange={(v) => updateCurrent({ licence: num(v) })}
              />
              <FormField
                label="Expected annual repairs"
                type="number"
                prefix="R"
                value={current.expectedAnnualRepairs}
                onChange={(v) => updateCurrent({ expectedAnnualRepairs: num(v) })}
              />
              <FormField
                label="Trade-in value"
                type="number"
                prefix="R"
                value={current.tradeInValue}
                onChange={(v) => updateCurrent({ tradeInValue: num(v), currentValue: num(v) })}
              />
              <FormField
                label="Residual value"
                type="number"
                prefix="R"
                value={current.residualValue}
                onChange={(v) => updateCurrent({ residualValue: num(v) })}
              />
              <FormField
                label="Fleet size"
                type="number"
                suffix="vehicles"
                value={assumptions.fleetVehicleCount}
                onChange={(v) =>
                  updateAssumptions({ fleetVehicleCount: Math.max(1, int(v)) })
                }
                min={1}
                max={100}
              />
              <div className="flex flex-wrap gap-4 sm:col-span-2">
                {[
                  { key: "hasTurbo" as const, label: "Turbo" },
                  { key: "hasDpf" as const, label: "DPF" },
                  { key: "warrantyExpired" as const, label: "Warranty expired" },
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
              </div>
            </ExpandableSection>
          </CardContent>
        </Card>

        {/* Replacement column */}
        <Card className="border-accent/25">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <div>
                <CardTitle className="text-base">Replacement vehicle</CardTitle>
                <p className="text-xs text-muted-foreground">What you are comparing against</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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

            {replacements.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {replacements.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => selectReplacement(v.id)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                      selectedId === v.id
                        ? "border-accent bg-accent/10 font-medium text-accent"
                        : "border-border hover:bg-muted"
                    )}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            )}

            {selected ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="success">Selected</Badge>
                  <span className="text-sm font-medium">{selected.name}</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="Vehicle name"
                    value={selected.name}
                    onChange={(v) => updateReplacement(selected.id, { name: v })}
                    className="sm:col-span-2"
                  />
                  <FormField
                    label="Price"
                    type="number"
                    prefix="R"
                    value={selected.price}
                    onChange={(v) => updateReplacement(selected.id, { price: num(v) })}
                  />
                  <FormField
                    label="Cash deposit"
                    type="number"
                    prefix="R"
                    value={additionalCashDeposit}
                    onChange={(v) => updateTradeIn({ additionalCashDeposit: num(v) })}
                    hint="On top of trade equity — editable on Trade-In step too."
                  />
                  <FormField
                    label="Interest rate"
                    type="number"
                    suffix="%"
                    value={selected.interestRate}
                    onChange={(v) => updateReplacement(selected.id, { interestRate: num(v) })}
                    min={3}
                    max={18}
                    step={0.1}
                  />
                  <FormField
                    label="Finance term"
                    type="number"
                    suffix="months"
                    value={selected.financeTermMonths}
                    onChange={(v) =>
                      updateReplacement(selected.id, { financeTermMonths: int(v) })
                    }
                    min={12}
                    max={96}
                  />
                  <FormSelect
                    label="Fuel type"
                    value={selected.fuelType}
                    options={FUEL_OPTIONS}
                    onChange={(v) =>
                      updateReplacement(selected.id, {
                        fuelType: v as typeof selected.fuelType,
                      })
                    }
                  />
                  <FormField
                    label="Energy consumption"
                    type="number"
                    suffix="kWh/100km"
                    value={selected.energyConsumption}
                    onChange={(v) =>
                      updateReplacement(selected.id, { energyConsumption: num(v) })
                    }
                    step={0.1}
                  />
                </div>

                <div className="rounded-lg border border-accent/20 bg-accent/5 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Estimated replacement repayment</p>
                  <p className="text-2xl font-bold tabular-nums text-accent">
                    {formatCurrency(result.kpis.replacementFinanceInstalment)}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </p>
                </div>

                <ExpandableSection title="Full replacement specs & costs">
                  <FormField
                    label="Fuel consumption"
                    type="number"
                    suffix="L/100km"
                    value={selected.fuelConsumption}
                    onChange={(v) =>
                      updateReplacement(selected.id, { fuelConsumption: num(v) })
                    }
                    step={0.1}
                  />
                  <FormField
                    label="Battery size"
                    type="number"
                    suffix="kWh"
                    value={selected.batterySizeKwh}
                    onChange={(v) =>
                      updateReplacement(selected.id, { batterySizeKwh: num(v) })
                    }
                  />
                  <FormField
                    label="Warranty"
                    type="number"
                    suffix="years"
                    value={selected.warrantyYears}
                    onChange={(v) =>
                      updateReplacement(selected.id, { warrantyYears: int(v) })
                    }
                  />
                  <FormField
                    label="Battery warranty"
                    type="number"
                    suffix="years"
                    value={selected.batteryWarrantyYears}
                    onChange={(v) =>
                      updateReplacement(selected.id, { batteryWarrantyYears: int(v) })
                    }
                  />
                  <FormField
                    label="Maintenance (annual)"
                    type="number"
                    prefix="R"
                    value={selected.maintenance}
                    onChange={(v) => updateReplacement(selected.id, { maintenance: num(v) })}
                  />
                  <FormField
                    label="Insurance (annual)"
                    type="number"
                    prefix="R"
                    value={selected.insurance}
                    onChange={(v) => updateReplacement(selected.id, { insurance: num(v) })}
                  />
                  <FormField
                    label="Expected resale"
                    type="number"
                    prefix="R"
                    value={selected.expectedResale}
                    onChange={(v) => updateReplacement(selected.id, { expectedResale: num(v) })}
                  />
                </ExpandableSection>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add a replacement vehicle using the presets above.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
