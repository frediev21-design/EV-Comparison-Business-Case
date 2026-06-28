import { describe, it, expect } from "vitest";
import { calculateMonthlyPayment, buildAmortisationSchedule } from "@/engine/finance";
import { calculateTradeIn } from "@/engine/trade-in";
import { runFullBusinessCase } from "@/engine";
import { createDefaultBusinessCase } from "@/store/defaults";

describe("finance engine", () => {
  it("calculates monthly payment correctly", () => {
    const payment = calculateMonthlyPayment(412000, 10, 72);
    expect(payment).toBeGreaterThan(7000);
    expect(payment).toBeLessThan(8000);
  });

  it("builds amortisation schedule with zero balance at end", () => {
    const schedule = buildAmortisationSchedule(412000, 10, 72);
    expect(schedule).toHaveLength(72);
    expect(schedule[71].balance).toBeLessThan(1);
  });
});

describe("trade-in engine", () => {
  it("calculates trade equity and total deposit", () => {
    const input = createDefaultBusinessCase();
    const result = calculateTradeIn(
      input.current,
      input.tradeIn,
      input.replacements[0]
    );
    expect(result.tradeEquity).toBe(348000);
    expect(result.totalDeposit).toBe(548000);
    expect(result.amountFinanced).toBe(412000);
  });
});

describe("full business case", () => {
  it("runs default scenario without errors", () => {
    const input = createDefaultBusinessCase();
    const result = runFullBusinessCase(input);
    expect(result.tradeIn.amountFinanced).toBe(412000);
    expect(result.finance).toHaveLength(1);
    expect(result.kpis.monthlySaving).toBeDefined();
    expect(result.recommendation).toContain("BYD Shark 6");
    expect(result.decision.executiveRecommendation).toContain("BYD Shark 6");
    expect(result.charts.monthlyCashFlow).toHaveLength(12);
  });
});
