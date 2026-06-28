import { describe, it, expect } from "vitest";
import { createDefaultBusinessCase } from "@/store/defaults";
import { runFullBusinessCase } from "@/engine";
import { generateRecommendationSummary } from "@/lib/recommendation-summary";

describe("recommendation-summary", () => {
  it("generates a customer-ready summary block", () => {
    const input = createDefaultBusinessCase();
    const result = runFullBusinessCase(input);
    const summary = generateRecommendationSummary(input, result);

    expect(summary).toContain("✓ RECOMMENDATION");
    expect(summary).toContain("Investment Score");
    expect(summary).toContain("Expected Monthly Saving");
    expect(summary).toContain("Confidence");
    expect(summary).toContain("Decision");
    expect(summary).toContain(`${result.decision.investmentScore.total} / 100`);
    expect(summary).toContain(result.decision.investmentScore.rating.toUpperCase());
  });
});
