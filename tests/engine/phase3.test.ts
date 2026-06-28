import { describe, it, expect } from "vitest";
import { runFullBusinessCase } from "@/engine";
import { createDefaultBusinessCase } from "@/store/defaults";
import { exportScenarioBundle, parseScenarioBundle } from "@/lib/scenario-io";
import { withMarketCache, clearMarketCache } from "@/lib/market/cache";

describe("fleet mode", () => {
  it("scales KPIs linearly with fleet size", () => {
    const single = runFullBusinessCase(createDefaultBusinessCase());
    const input = createDefaultBusinessCase();
    input.assumptions.fleetVehicleCount = 5;
    const fleet = runFullBusinessCase(input);

    expect(fleet.kpis.fleetVehicleCount).toBe(5);
    expect(fleet.kpis.monthlySaving).toBeCloseTo(single.kpis.monthlySaving * 5, 0);
    expect(fleet.tradeIn.amountFinanced).toBeCloseTo(single.tradeIn.amountFinanced * 5, 0);
  });
});

describe("scenario bundle", () => {
  it("exports and parses a bundle", () => {
    const input = createDefaultBusinessCase();
    const bundle = exportScenarioBundle([
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        name: "A",
        tags: [],
        snapshot: input,
      },
    ]);
    const json = JSON.stringify(bundle);
    const parsed = parseScenarioBundle(json);
    expect(parsed.scenarios).toHaveLength(1);
  });
});

describe("market cache", () => {
  it("returns cache hit on second lookup", () => {
    clearMarketCache();
    let calls = 0;
    const first = withMarketCache("test-key", () => {
      calls += 1;
      return { value: 1 };
    });
    const second = withMarketCache("test-key", () => {
      calls += 1;
      return { value: 2 };
    });
    expect(first.meta.cacheHit).toBe(false);
    expect(second.meta.cacheHit).toBe(true);
    expect(second.data).toEqual({ value: 1 });
    expect(calls).toBe(1);
  });
});
