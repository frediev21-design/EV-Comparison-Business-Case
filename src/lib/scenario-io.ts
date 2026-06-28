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
