import { describe, it, expect } from "vitest";
import { buildCurrentFinanceResult } from "@/engine/current-finance";
import { calculateOwnership } from "@/engine/ownership";
import { createDefaultBusinessCase } from "@/store/defaults";
import { runFullBusinessCase } from "@/engine";
import { parseCaseImport, serializeCaseExport, exportCaseToJson } from "@/lib/scenario-io";

describe("current finance in ownership", () => {
  it("includes current loan payments in ownership TCO", () => {
    const input = createDefaultBusinessCase();
    const currentFinance = buildCurrentFinanceResult(input.current);
    expect(currentFinance).toBeDefined();
    expect(currentFinance!.monthlyInstalment).toBeGreaterThan(0);

    const running = { fuel: 1000, electricity: 0, solar: 0, grid: 0, maintenance: 0, insurance: 0, tyres: 0, licence: 0, repairs: 0, servicePlans: 0, total: 1000 };
    const ownership = calculateOwnership(
      running,
      {},
      [],
      input.current.residualValue,
      {},
      50,
      currentFinance
    );

    const withoutFinance = calculateOwnership(running, {}, [], input.current.residualValue, {}, 50);
    expect(ownership.current[0].totalCost).toBeGreaterThan(withoutFinance.current[0].totalCost);
  });

  it("full business case ownership includes current finance", () => {
    const result = runFullBusinessCase(createDefaultBusinessCase());
    const tenYear = result.ownership.current.find((h) => h.years === 10);
    expect(tenYear?.totalCost).toBeGreaterThan(result.running.current.total * 10);
  });
});

describe("scenario export/import", () => {
  it("round-trips case JSON", () => {
    const input = createDefaultBusinessCase();
    const exported = exportCaseToJson("Test Case", ["Business Use"], input);
    const json = serializeCaseExport(exported);
    const imported = parseCaseImport(json);
    expect(imported.name).toBe("Test Case");
    expect(imported.snapshot.current.model).toBe(input.current.model);
  });
});
