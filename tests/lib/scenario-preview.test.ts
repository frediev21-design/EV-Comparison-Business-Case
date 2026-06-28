import { describe, it, expect } from "vitest";
import { createDefaultBusinessCase } from "@/store/defaults";
import { previewScenario, getResumeStep } from "@/lib/scenario-preview";

describe("scenario-preview", () => {
  it("builds preview metrics from a snapshot", () => {
    const snapshot = createDefaultBusinessCase();
    const preview = previewScenario(snapshot);

    expect(preview.vehicleComparison).toContain("→");
    expect(preview.investmentScore).toBeGreaterThan(0);
    expect(preview.trafficLight).toMatch(/go|review|stop/);
    expect(typeof preview.monthlySaving).toBe("number");
  });

  it("resumes at dashboard when data entry is complete", () => {
    const snapshot = createDefaultBusinessCase();
    expect(getResumeStep(snapshot)).toBe("dashboard");
  });

  it("resumes at first incomplete data entry step", () => {
    const snapshot = createDefaultBusinessCase();
    snapshot.current.manufacturer = "";
    snapshot.current.model = "";
    expect(getResumeStep(snapshot)).toBe("vehicles");
  });
});
