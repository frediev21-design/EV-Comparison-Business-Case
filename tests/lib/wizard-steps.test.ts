import { describe, it, expect } from "vitest";
import {
  SHOWROOM_WORKFLOW_STEPS,
  getNextStep,
  getPrevStep,
  getWorkflowSteps,
  parseWorkflowMode,
} from "@/lib/wizard-steps";

describe("showroom workflow", () => {
  it("uses a minimal step order", () => {
    expect(SHOWROOM_WORKFLOW_STEPS).toEqual([
      "current",
      "replacement",
      "trade-in",
      "dashboard",
      "reports",
    ]);
  });

  it("skips market and what-if after trade-in", () => {
    expect(getNextStep("trade-in", "showroom")).toBe("dashboard");
    expect(getPrevStep("dashboard", "showroom")).toBe("trade-in");
  });

  it("is shorter than quick and full", () => {
    expect(getWorkflowSteps("showroom").length).toBeLessThan(getWorkflowSteps("quick").length);
    expect(getWorkflowSteps("quick").length).toBeLessThan(getWorkflowSteps("full").length);
  });

  it("parses showroom mode from URL params", () => {
    expect(parseWorkflowMode("showroom")).toBe("showroom");
    expect(parseWorkflowMode("invalid")).toBeNull();
  });
});
