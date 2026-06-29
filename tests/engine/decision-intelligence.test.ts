import { describe, it, expect } from "vitest";
import { runFullBusinessCase } from "@/engine";
import { createDefaultBusinessCase } from "@/store/defaults";
import { calculateInvestmentScore, calculateTrafficLight } from "@/engine/decision/score";

describe("decision intelligence", () => {
  it("calculates investment score between 0 and 100", () => {
    const input = createDefaultBusinessCase();
    const result = runFullBusinessCase(input);
    expect(result.decision.investmentScore.total).toBeGreaterThanOrEqual(0);
    expect(result.decision.investmentScore.total).toBeLessThanOrEqual(100);
    expect(result.decision.investmentScore.criteria).toHaveLength(8);
  });

  it("assigns traffic light based on score", () => {
    const input = createDefaultBusinessCase();
    const result = runFullBusinessCase(input);
    expect(["go", "review", "stop"]).toContain(result.decision.trafficLight.status);
  });

  it("generates SWOT with four quadrants", () => {
    const input = createDefaultBusinessCase();
    const result = runFullBusinessCase(input);
    expect(result.decision.swot.strengths.length).toBeGreaterThan(0);
    expect(result.decision.swot.weaknesses.length).toBeGreaterThan(0);
    expect(result.decision.advisorTips.length).toBeGreaterThan(0);
  });

  it("scores strongly for favourable default scenario", () => {
    const input = createDefaultBusinessCase();
    const result = runFullBusinessCase(input);
    const score = calculateInvestmentScore(
      input,
      result.kpis,
      result.running,
      result.risk,
      result.tradeIn
    );
    expect(score.total).toBeGreaterThanOrEqual(70);
    const light = calculateTrafficLight(score.total, result.kpis);
    expect(light.status).not.toBe("stop");
  });
});
