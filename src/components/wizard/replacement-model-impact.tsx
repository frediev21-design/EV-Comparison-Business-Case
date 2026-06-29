"use client";

import { useCaseStore } from "@/store/case-store";
import { formatCurrency } from "@/lib/format";
import type { ReplacementVehicle } from "@/engine/types";

function formatScore(value: number): string {
  return value.toFixed(1);
}

export function ReplacementModelImpact({ vehicle }: { vehicle: ReplacementVehicle }) {
  const selectedId = useCaseStore((s) => s.input.selectedReplacementId);
  const assumptions = useCaseStore((s) => s.input.assumptions);
  const running = useCaseStore((s) => s.result.running.replacements[vehicle.id]);
  const score = useCaseStore((s) => s.result.decision.investmentScore.total);

  if (selectedId !== vehicle.id) return null;

  const usesFuel =
    vehicle.fuelType === "phev" ||
    vehicle.fuelType === "hybrid" ||
    vehicle.fuelType === "diesel" ||
    vehicle.fuelType === "petrol";

  if (!usesFuel) return null;

  const noDistance = assumptions.dailyDistanceKm <= 0;

  return (
    <div className="mt-4 rounded-lg border border-border/80 bg-muted/30 px-4 py-3 text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Live model impact
      </p>
      {noDistance ? (
        <p className="mt-2 text-muted-foreground">
          Set <strong>daily distance</strong> on the Current Vehicle step — fuel consumption cannot
          affect costs or score until distance is entered.
        </p>
      ) : (
        <dl className="mt-2 grid gap-2 sm:grid-cols-3">
          {vehicle.fuelType === "phev" && (
            <div>
              <dt className="text-xs text-muted-foreground">Modelled ICE fuel / yr</dt>
              <dd className="font-semibold tabular-nums">{formatCurrency(running?.fuel ?? 0)}</dd>
              <dd className="text-[11px] text-muted-foreground">
                {assumptions.phevElectricPercent ?? 50}% on battery · {assumptions.dailyDistanceKm}{" "}
                km/day
              </dd>
            </div>
          )}
          {(vehicle.fuelType === "diesel" || vehicle.fuelType === "petrol") && (
            <div>
              <dt className="text-xs text-muted-foreground">Modelled fuel / yr</dt>
              <dd className="font-semibold tabular-nums">{formatCurrency(running?.fuel ?? 0)}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-muted-foreground">Investment score</dt>
            <dd className="font-semibold tabular-nums">{formatScore(score)} / 100</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Annual running total</dt>
            <dd className="font-semibold tabular-nums">{formatCurrency(running?.total ?? 0)}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
