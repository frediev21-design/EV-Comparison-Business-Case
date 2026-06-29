import { describe, it, expect } from "vitest";
import { createDefaultBusinessCase, createId } from "@/store/defaults";
import { computeReplacementComparison } from "@/lib/replacement-comparison";

describe("replacement comparison", () => {
  it("compares multiple replacements with distinct finance outcomes", () => {
    const input = createDefaultBusinessCase();
    const secondId = createId();
    input.replacements.push({
      id: secondId,
      name: "BYD Dolphin",
      manufacturer: "BYD",
      price: 520000,
      deposit: 0,
      interestRate: 10,
      financeTermMonths: 72,
      fuelType: "electric",
      batterySizeKwh: 60,
      fuelConsumption: 0,
      energyConsumption: 15,
      warrantyYears: 6,
      batteryWarrantyYears: 8,
      maintenance: 5000,
      insurance: 14000,
      expectedResale: 280000,
    });

    const rows = computeReplacementComparison(input);
    expect(rows).toHaveLength(2);
    expect(rows.some((row) => row.name.includes("Shark"))).toBe(true);
    expect(rows.some((row) => row.name.includes("Dolphin"))).toBe(true);
    expect(rows[0].financeRequired).not.toBe(rows[1].financeRequired);
  });
});
