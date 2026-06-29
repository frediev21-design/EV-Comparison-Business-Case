import { describe, it, expect } from "vitest";
import { runFullBusinessCase } from "@/engine";
import { createDefaultBusinessCase } from "@/store/defaults";
import { buildCurrentFinanceResult } from "@/engine/current-finance";
import { calculateComparisonNpv } from "@/engine/npv";
import { runningTotalForYear } from "@/engine/ownership";
import { kmMultiplierForYear } from "@/engine/ownership-utils";
import { splitEvChargingCost } from "@/engine/charging-cost";

describe("tier 2 model improvements", () => {
  it("monthly saving uses 10-year horizon average (post-loan aware)", () => {
    const result = runFullBusinessCase(createDefaultBusinessCase());
    const current10 = result.ownership.current.find((h) => h.years === 10);
    const repl10 = result.ownership.replacements[result.finance[0].vehicleId]?.find(
      (h) => h.years === 10
    );

    expect(result.kpis.monthlySaving).toBeCloseTo(
      (current10?.monthlyCost ?? 0) - (repl10?.monthlyCost ?? 0),
      0
    );
    expect(result.kpis.monthlySaving).not.toBeCloseTo(
      result.kpis.currentMonthlyCost - result.kpis.replacementMonthlyCost,
      0
    );
  });

  it("solar charging includes amortised system cost, not free solar", () => {
    const input = createDefaultBusinessCase();
    input.solar.solarChargingPercent = 80;
    input.solar.gridChargingPercent = 20;
    const result = runFullBusinessCase(input);
    const repl = result.running.replacements[input.selectedReplacementId];

    expect(repl.solar).toBeGreaterThan(0);
    expect(result.solar.annualSolarAmortisation).toBeGreaterThan(0);
  });

  it("peak/off-peak blend increases grid cost vs flat tariff", () => {
    const input = createDefaultBusinessCase();
    const base = runFullBusinessCase(input);
    input.solar.gridPeakPercent = 80;
    input.solar.peakTariff = 5.5;
    input.solar.offPeakTariff = 1.8;
    const peakHeavy = runFullBusinessCase(input);

    expect(
      peakHeavy.running.replacements[input.selectedReplacementId].grid
    ).toBeGreaterThan(base.running.replacements[input.selectedReplacementId].grid);
  });

  it("annual km growth increases 10-year ownership running total", () => {
    const input = createDefaultBusinessCase();
    input.assumptions.annualKmGrowth = 0;
    const flat = runFullBusinessCase(input);
    input.assumptions.annualKmGrowth = 5;
    const growing = runFullBusinessCase(input);

    const flat10 = flat.ownership.current.find((h) => h.years === 10);
    const growing10 = growing.ownership.current.find((h) => h.years === 10);
    expect(growing10!.totalCost).toBeGreaterThan(flat10!.totalCost);
  });

  it("NPV is finite and responds to discount rate", () => {
    const input = createDefaultBusinessCase();
    const result = runFullBusinessCase(input);
    expect(Number.isFinite(result.kpis.npv10Year)).toBe(true);

    input.assumptions.discountRate = 0;
    const noDiscount = runFullBusinessCase(input);
    expect(noDiscount.kpis.npv10Year).not.toBeCloseTo(result.kpis.npv10Year, -2);
  });

  it("NPV helper matches resale and finance schedules", () => {
    const input = createDefaultBusinessCase();
    const result = runFullBusinessCase(input);
    const currentFinance = buildCurrentFinanceResult(input.current);
    const replFinance = result.finance[0];
    const growth = input.assumptions.annualKmGrowth;

    const npv = calculateComparisonNpv(
      10,
      currentFinance,
      replFinance,
      (year) => runningTotalForYear(result.running.current, kmMultiplierForYear(year, growth)),
      (year) =>
        runningTotalForYear(
          result.running.replacements[input.selectedReplacementId],
          kmMultiplierForYear(year, growth)
        ),
      input.current.residualValue,
      input.replacements[0].expectedResale,
      input.assumptions.discountRate
    );

    expect(npv).toBeCloseTo(result.kpis.npv10Year, 0);
  });

  it("splitEvChargingCost applies blended grid tariff", () => {
    const input = createDefaultBusinessCase();
    const charging = splitEvChargingCost(1000, 50, 50, input.solar, input.assumptions);
    expect(charging.grid).toBeGreaterThan(0);
    expect(charging.solar).toBeGreaterThan(0);
    expect(charging.electricity).toBe(charging.grid + charging.solar);
  });
});
