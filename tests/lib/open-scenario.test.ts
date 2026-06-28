import { describe, it, expect } from "vitest";
import { createDefaultBusinessCase } from "@/store/defaults";
import { resolveOpenScenarioStep } from "@/hooks/use-open-scenario";
import type { ScenarioRecord } from "@/engine/types";

function makeRecord(snapshot = createDefaultBusinessCase()): ScenarioRecord {
  const now = new Date().toISOString();
  return {
    id: "test-id",
    name: "Test scenario",
    tags: [],
    createdAt: now,
    updatedAt: now,
    snapshot,
    workflowMode: "full",
  };
}

describe("use-open-scenario helpers", () => {
  it("opens at dashboard when setup is complete", () => {
    const record = makeRecord();
    expect(resolveOpenScenarioStep(record)).toBe("dashboard");
  });

  it("opens at current when vehicle details are missing", () => {
    const snapshot = createDefaultBusinessCase();
    snapshot.current.manufacturer = "";
    expect(resolveOpenScenarioStep(makeRecord(snapshot))).toBe("current");
  });

  it("respects quick mode when choosing resume step", () => {
    const snapshot = createDefaultBusinessCase();
    snapshot.replacements = [];
    snapshot.selectedReplacementId = "";
    expect(resolveOpenScenarioStep(makeRecord(snapshot), { workflowMode: "quick" })).toBe(
      "replacement"
    );
  });
});
