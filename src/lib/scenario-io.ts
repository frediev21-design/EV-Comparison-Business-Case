import type { BusinessCaseInput } from "@/engine/types";

export interface ExportedCaseFile {
  version: 1;
  exportedAt: string;
  name: string;
  tags: string[];
  snapshot: BusinessCaseInput;
}

export function exportCaseToJson(
  name: string,
  tags: string[],
  snapshot: BusinessCaseInput
): ExportedCaseFile {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    name,
    tags,
    snapshot,
  };
}

export function serializeCaseExport(data: ExportedCaseFile): string {
  return JSON.stringify(data, null, 2);
}

export function parseCaseImport(raw: string): ExportedCaseFile {
  const parsed = JSON.parse(raw) as ExportedCaseFile;
  if (parsed.version !== 1 || !parsed.snapshot?.current || !parsed.snapshot?.replacements) {
    throw new Error("Invalid case file format");
  }
  return parsed;
}

export function downloadCaseJson(data: ExportedCaseFile, filename: string) {
  const blob = new Blob([serializeCaseExport(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.endsWith(".json") ? filename : `${filename}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export interface ScenarioBundle {
  version: 1;
  exportedAt: string;
  scenarios: ExportedCaseFile[];
}

export function exportScenarioBundle(scenarios: ExportedCaseFile[]): ScenarioBundle {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    scenarios,
  };
}

export function parseScenarioBundle(raw: string): ScenarioBundle {
  const parsed = JSON.parse(raw) as ScenarioBundle;
  if (parsed.version !== 1 || !Array.isArray(parsed.scenarios)) {
    throw new Error("Invalid scenario bundle format");
  }
  for (const scenario of parsed.scenarios) {
    if (!scenario.snapshot?.current || !scenario.snapshot?.replacements) {
      throw new Error(`Invalid scenario in bundle: ${scenario.name}`);
    }
  }
  return parsed;
}

export function downloadScenarioBundle(bundle: ScenarioBundle, filename: string) {
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename.endsWith(".json") ? filename : `${filename}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
