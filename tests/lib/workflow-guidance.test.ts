import { describe, it, expect } from "vitest";
import { createEmptyBusinessCase, createDefaultBusinessCase } from "@/store/defaults";
import {
  getNextIncompleteStep,
  isSetupComplete,
  shouldShowFullSetupBanner,
} from "@/lib/workflow-guidance";

describe("workflow guidance", () => {
  it("returns first incomplete step for empty case", () => {
    const input = createEmptyBusinessCase();
    expect(getNextIncompleteStep("full", input)).toBe("current");
    expect(isSetupComplete("full", input)).toBe(false);
  });

  it("returns null when quick setup is complete", () => {
    const input = createDefaultBusinessCase();
    expect(getNextIncompleteStep("quick", input)).toBeNull();
    expect(isSetupComplete("quick", input)).toBe(true);
  });

  it("shows full banner only for early setup progress", () => {
    expect(shouldShowFullSetupBanner(0)).toBe(true);
    expect(shouldShowFullSetupBanner(1)).toBe(true);
    expect(shouldShowFullSetupBanner(2)).toBe(false);
  });
});
