import { describe, it, expect } from "vitest";
import { buildCurrentMonthlyFromInputs } from "@/lib/current-monthly-breakdown";
import { createDefaultBusinessCase } from "@/store/defaults";

describe("buildCurrentMonthlyFromInputs", () => {
  it("uses Current Vehicle form fields for operating costs", () => {
    const input = createDefaultBusinessCase();
    input.current.monthlyInstalment = 9250;
    input.current.maintenance = 12000;
    input.current.insurance = 20000;
    input.assumptions.dailyDistanceKm = 40;
    input.assumptions.fuelPricePerLitre = 22;

    const breakdown = buildCurrentMonthlyFromInputs(input);

    expect(breakdown.instalment).toBe(9250);
    expect(breakdown.running.maintenance).toBe(12000);
    expect(breakdown.running.insurance).toBe(20000);
    expect(breakdown.lines.find((l) => l.label === "Maintenance")?.source).toContain("12");
    expect(breakdown.totalMonthly).toBe(breakdown.instalment + breakdown.operatingMonthly);
  });
});
