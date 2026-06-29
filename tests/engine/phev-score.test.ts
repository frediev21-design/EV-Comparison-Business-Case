import { describe, it, expect } from "vitest";
import { runFullBusinessCase } from "@/engine";
import { createDefaultBusinessCase } from "@/store/defaults";

describe("PHEV fuel consumption affects investment score", () => {
  it("score changes when fuel consumption changes materially", () => {
    const input = createDefaultBusinessCase();
    const base = runFullBusinessCase(input);

    input.replacements[0].fuelConsumption = 15;
    const highFuel = runFullBusinessCase(input);

    expect(highFuel.running.replacements[input.selectedReplacementId].fuel).toBeGreaterThan(
      base.running.replacements[input.selectedReplacementId].fuel
    );
    expect(highFuel.kpis.tenYearSaving).toBeLessThan(base.kpis.tenYearSaving);
    expect(highFuel.decision.investmentScore.total).toBeLessThan(
      base.decision.investmentScore.total
    );
  });

  it("7.5 vs 7 updates modelled fuel and score (one decimal)", () => {
    const input = createDefaultBusinessCase();
    const at75 = runFullBusinessCase(input);
    input.replacements[0].fuelConsumption = 7;
    const at7 = runFullBusinessCase(input);

    expect(at7.running.replacements[input.selectedReplacementId].fuel).toBeLessThan(
      at75.running.replacements[input.selectedReplacementId].fuel
    );
    expect(at7.decision.investmentScore.total).toBeGreaterThan(
      at75.decision.investmentScore.total
    );
  });

  it("fuel running cost is zero when daily distance is zero", () => {
    const input = createDefaultBusinessCase();
    input.assumptions.dailyDistanceKm = 0;
    const a = runFullBusinessCase(input);
    input.replacements[0].fuelConsumption = 20;
    const b = runFullBusinessCase(input);
    expect(b.running.replacements[input.selectedReplacementId].fuel).toBe(0);
    expect(a.running.replacements[input.selectedReplacementId].fuel).toBe(0);
  });

  it("environmental criterion reflects PHEV fuel consumption", () => {
    const input = createDefaultBusinessCase();
    const efficient = runFullBusinessCase(input);
    input.replacements[0].fuelConsumption = 14;
    const thirsty = runFullBusinessCase(input);

    const effEnv = efficient.decision.investmentScore.criteria.find(
      (c) => c.id === "environmentalImpact"
    )?.score;
    const thirstEnv = thirsty.decision.investmentScore.criteria.find(
      (c) => c.id === "environmentalImpact"
    )?.score;
    expect(effEnv).toBeGreaterThan(thirstEnv ?? 0);
  });
});
