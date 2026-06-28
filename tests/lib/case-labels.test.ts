import { describe, it, expect } from "vitest";
import {
  autoCaseNameFromCurrent,
  buildVehicleComparisonLabel,
  shouldAutoUpdateCaseName,
} from "@/lib/case-labels";
import { createDefaultBusinessCase } from "@/store/defaults";

describe("case-labels", () => {
  it("builds a live vehicle comparison label", () => {
    const input = createDefaultBusinessCase();
    input.current.manufacturer = "Audi";
    input.current.model = "A5 3.2";
    expect(buildVehicleComparisonLabel(input)).toBe("Audi A5 3.2 → BYD Shark 6");
  });

  it("auto-updates case name when it still matches the previous vehicle", () => {
    const input = createDefaultBusinessCase();
    const previous = { ...input.current };
    const next = { ...input.current, manufacturer: "Audi", model: "A5 3.2" };

    expect(shouldAutoUpdateCaseName("Ford Wildtrak Bi-Turbo", previous, next)).toBe(true);
    expect(autoCaseNameFromCurrent(next)).toBe("Audi A5 3.2");
  });

  it("keeps a custom scenario name when the vehicle changes", () => {
    const input = createDefaultBusinessCase();
    const previous = { ...input.current };
    const next = { ...input.current, manufacturer: "Audi", model: "A5 3.2" };

    expect(shouldAutoUpdateCaseName("Fleet Q3 rollout", previous, next)).toBe(false);
  });
});
