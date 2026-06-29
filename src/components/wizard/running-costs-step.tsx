"use client";

import { useCaseStore } from "@/store/case-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormSection } from "./form-field";
import { formatCurrency } from "@/lib/format";
import type { RunningCostBreakdown } from "@/engine/types";

function CostTable({ title, costs }: { title: string; costs: RunningCostBreakdown }) {
  const rows = [
    { label: "Fuel", value: costs.fuel },
    { label: "Electricity", value: costs.electricity },
    { label: "Maintenance", value: costs.maintenance },
    { label: "Insurance", value: costs.insurance },
    { label: "Tyres", value: costs.tyres },
    { label: "Licence", value: costs.licence },
    { label: "Repairs", value: costs.repairs },
  ].filter((r) => r.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <tbody>
            {rows.map(({ label, value }) => (
              <tr key={label} className="border-b border-border/50">
                <td className="py-2 text-muted-foreground">{label}</td>
                <td className="py-2 text-right font-medium tabular-nums">{formatCurrency(value)}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className="pt-3">Total Annual</td>
              <td className="pt-3 text-right tabular-nums text-accent">{formatCurrency(costs.total)}</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export function RunningCostsStep() {
  const running = useCaseStore((s) => s.result.running);
  const assumptions = useCaseStore((s) => s.input.assumptions);
  const selectedId = useCaseStore((s) => s.input.selectedReplacementId);
  const updateAssumptions = useCaseStore((s) => s.updateAssumptions);
  const selectedName = useCaseStore((s) =>
    s.input.replacements.find((v) => v.id === selectedId)?.name ?? "Replacement"
  );
  const selectedRunning = running.replacements[selectedId];
  const hasPhev = useCaseStore((s) => s.input.replacements.some((v) => v.fuelType === "phev"));

  const num = (v: string) => parseFloat(v) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Running Costs</h2>
        <p className="text-sm text-muted-foreground">
          Adjust key assumptions, then compare annual operating costs side by side.
        </p>
      </div>

      <FormSection
        title="Cost assumptions"
        description="These drive fuel, electricity, and distance-based calculations."
      >
        <FormField
          label="Daily distance"
          type="number"
          suffix="km/day"
          value={assumptions.dailyDistanceKm}
          onChange={(v) => updateAssumptions({ dailyDistanceKm: num(v) })}
          min={1}
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
        <FormField
          label="Electricity tariff"
          type="number"
          prefix="R"
          suffix="/kWh"
          value={assumptions.electricityTariff}
          onChange={(v) => updateAssumptions({ electricityTariff: num(v) })}
          step={0.01}
        />
        {hasPhev && (
          <FormField
            label="PHEV distance on battery"
            type="number"
            suffix="%"
            value={assumptions.phevElectricPercent ?? 50}
            onChange={(v) => updateAssumptions({ phevElectricPercent: num(v) })}
            min={0}
            max={100}
            step={5}
          />
        )}
      </FormSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <CostTable title="Current Vehicle" costs={running.current} />
        {selectedRunning && <CostTable title={selectedName} costs={selectedRunning} />}
      </div>
    </div>
  );
}
