import { describe, it, expect } from "vitest";
import { getCaseValidationMessages, isStepComplete, getDataEntryProgress } from "@/lib/wizard-validation";
import { createDefaultBusinessCase } from "@/store/defaults";
import { runFullBusinessCase } from "@/engine";

describe("wizard validation", () => {
  it("marks current step complete for default case", () => {
    const input = createDefaultBusinessCase();
    expect(isStepComplete("current", input)).toBe(true);
  });

  it("warns when instalment looks like total monthly cost", () => {
    const input = createDefaultBusinessCase();
    input.current.monthlyInstalment = 97218;
    input.current.outstandingFinance = 485000;
    const result = runFullBusinessCase(input);
    const messages = getCaseValidationMessages(input, result);
    expect(messages.some((m) => m.id === "instalment-total-cost")).toBe(true);
  });

  it("reports data entry progress", () => {
    const input = createDefaultBusinessCase();
    const progress = getDataEntryProgress(input, "quick");
    expect(progress.total).toBe(3);
    expect(progress.completed).toBeGreaterThan(0);
  });
});
