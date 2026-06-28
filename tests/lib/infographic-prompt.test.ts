import { describe, it, expect } from "vitest";
import { createDefaultBusinessCase } from "@/store/defaults";
import { runFullBusinessCase } from "@/engine";
import {
  generateInfographicPrompt,
  isInfographicPromptReady,
} from "@/lib/infographic-prompt";

describe("infographic-prompt", () => {
  it("is ready when current, replacement, and trade-in are complete", () => {
    const input = createDefaultBusinessCase();
    expect(isInfographicPromptReady(input)).toBe(true);
  });

  it("generates a prompt with key business case data", () => {
    const input = createDefaultBusinessCase();
    const result = runFullBusinessCase(input);
    const prompt = generateInfographicPrompt(input, result, "Ford vs BYD");

    expect(prompt).toContain("Ford Wildtrak Bi-Turbo → BYD Shark 6");
    expect(prompt).toContain("Ford vs BYD");
    expect(prompt).toContain("Monthly saving");
    expect(prompt).toContain("investment score");
    expect(prompt).toContain(result.decision.trafficLight.label);
    expect(prompt).toContain("BYD Shark 6");
    expect(prompt).not.toMatch(/^\s*$/);
  });
});
