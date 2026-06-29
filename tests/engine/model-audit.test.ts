import { describe, it, expect } from "vitest";
import { runFullBusinessCase } from "@/engine";
import { createDefaultBusinessCase, createEmptyBusinessCase } from "@/store/defaults";
import { getOwnershipForHorizon } from "@/engine/ownership";

describe("model audit — accuracy and conservatism", () => {
  it("default Wildtrak → Shark: tenYearSaving matches 10-year net TCO delta", () => {
    const result = runFullBusinessCase(createDefaultBusinessCase());
    const k = result.kpis;
    const current10 = getOwnershipForHorizon(result.ownership, "current", 10);
    const repl10 = getOwnershipForHorizon(
      result.ownership,
      result.finance[0].vehicleId,
      10
    );

    const tcoDelta10 =
      (current10?.netOwnershipCost ?? 0) - (repl10?.netOwnershipCost ?? 0);

    expect(k.monthlySaving).toBeGreaterThan(0);
    expect(k.tenYearSaving).toBe(tcoDelta10);
    expect(k.tenYearSaving).not.toBe(k.annualSaving * 10);
  });

  it("PHEV Shark applies blended fuel when fuelConsumption is set", () => {
    const input = createDefaultBusinessCase();
    const base = runFullBusinessCase(input);
    input.replacements[0].fuelConsumption = 15;
    const inflated = runFullBusinessCase(input);

    expect(inflated.running.replacements[input.selectedReplacementId].fuel).toBeGreaterThan(0);
    expect(
      inflated.running.replacements[input.selectedReplacementId].total
    ).toBeGreaterThan(base.running.replacements[input.selectedReplacementId].total);
  });

  it("replacement includes expected annual repairs", () => {
    const input = createDefaultBusinessCase();
    expect(input.replacements[0].expectedAnnualRepairs).toBeGreaterThan(0);
    const result = runFullBusinessCase(input);
    const repl = result.running.replacements[input.selectedReplacementId];
    expect(repl.repairs).toBe(input.replacements[0].expectedAnnualRepairs);
  });

  it("PHEV electric share reduces fuel use when increased", () => {
    const input = createDefaultBusinessCase();
    input.assumptions.phevElectricPercent = 30;
    const lowElectric = runFullBusinessCase(input);
    input.assumptions.phevElectricPercent = 80;
    const highElectric = runFullBusinessCase(input);

    expect(highElectric.running.replacements[input.selectedReplacementId].fuel).toBeLessThan(
      lowElectric.running.replacements[input.selectedReplacementId].fuel
    );
  });

  it("blank case: score is bounded, no NaN", () => {
    const result = runFullBusinessCase(createEmptyBusinessCase());
    expect(Number.isFinite(result.decision.investmentScore.total)).toBe(true);
    expect(result.decision.investmentScore.total).toBeGreaterThanOrEqual(0);
  });

  it("payback excludes trade equity from numerator", () => {
    const input = createDefaultBusinessCase();
    const result = runFullBusinessCase(input);
    const financed = result.tradeIn.amountFinanced;
    const cash = input.tradeIn.additionalCashDeposit;
    const expected = Math.ceil((financed - cash) / result.kpis.monthlySaving);
    expect(result.kpis.paybackMonths).toBe(expected);
    expect(result.tradeIn.tradeEquity).toBeGreaterThan(cash);
  });
});
