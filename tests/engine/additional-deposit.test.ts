import { describe, it, expect } from "vitest";
import { createDefaultBusinessCase } from "@/store/defaults";
import { runFullBusinessCase } from "@/engine";

describe("additional cash deposit", () => {
  it("updates trade-in waterfall and finance when additionalCashDeposit changes", () => {
    const input = createDefaultBusinessCase();
    input.tradeIn.additionalCashDeposit = 50000;
    const result = runFullBusinessCase(input);

    expect(result.tradeIn.additionalCash).toBe(50000);
    expect(result.tradeIn.totalDeposit).toBe(348000 + 50000);
    expect(result.tradeIn.amountFinanced).toBe(960000 - 398000);
    expect(result.finance[0].amountFinanced).toBe(960000 - 398000);
  });

  it("scales additional cash in fleet mode for totals but input stays per vehicle", () => {
    const input = createDefaultBusinessCase();
    input.assumptions.fleetVehicleCount = 3;
    input.tradeIn.additionalCashDeposit = 100000;
    const result = runFullBusinessCase(input);

    expect(result.tradeIn.additionalCash).toBe(300000);
  });
});
