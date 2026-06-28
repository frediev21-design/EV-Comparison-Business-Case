import { describe, it, expect } from "vitest";
import { runFullBusinessCase } from "@/engine";
import { resolveCurrentFinanceInstalment } from "@/engine/current-finance";
import { createDefaultBusinessCase } from "@/store/defaults";

const screenshotWhatIf = {
  dailyDistanceKm: 50,
  fuelPricePerLitre: 23.5,
  electricityTariff: 4.0,
  interestRate: 10,
  tradeValue: 550000,
  outstandingFinance: 485000,
  solarPercent: 85,
  gridPercent: 15,
  maintenance: 1000,
};

describe("what-if monthly saving sanity", () => {
  it("returns realistic savings for the screenshot scenario", () => {
    const input = createDefaultBusinessCase();
    const result = runFullBusinessCase({
      ...input,
      whatIf: screenshotWhatIf,
    });

    expect(result.kpis.currentMonthlyCost).toBeGreaterThan(15000);
    expect(result.kpis.currentMonthlyCost).toBeLessThan(22000);
    expect(result.kpis.monthlySaving).toBeGreaterThan(0);
    expect(result.kpis.monthlySaving).toBeLessThan(5000);
    expect(result.kpis.operatingMonthlySaving).toBeGreaterThan(0);
    expect(result.kpis.financeMonthlyDelta).toBeLessThan(0);
  });

  it("does not inflate savings when monthly instalment includes total vehicle cost", () => {
    const input = createDefaultBusinessCase();
    const inflated = runFullBusinessCase({
      ...input,
      current: {
        ...input.current,
        outstandingFinance: 485000,
        monthlyInstalment: 97218,
      },
      whatIf: screenshotWhatIf,
    });

    expect(inflated.kpis.currentFinanceInstalment).toBeLessThan(15000);
    expect(inflated.kpis.monthlySaving).toBeLessThan(5000);
    expect(inflated.kpis.monthlySaving).not.toBeCloseTo(89539, -2);
  });
});

describe("resolveCurrentFinanceInstalment", () => {
  it("keeps a plausible instalment", () => {
    expect(
      resolveCurrentFinanceInstalment({
        monthlyInstalment: 10450,
        outstandingFinance: 272000,
      })
    ).toBe(10450);
  });

  it("estimates finance payment when instalment looks like total monthly cost", () => {
    const estimated = resolveCurrentFinanceInstalment({
      monthlyInstalment: 97218,
      outstandingFinance: 485000,
    });
    expect(estimated).toBeGreaterThan(8000);
    expect(estimated).toBeLessThan(11000);
  });
});
