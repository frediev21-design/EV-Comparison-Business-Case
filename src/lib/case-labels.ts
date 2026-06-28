import type { BusinessCaseInput } from "@/engine/types";

export function buildCurrentVehicleLabel(current: BusinessCaseInput["current"]): string {
  return `${current.manufacturer} ${current.model}`.trim();
}

export function buildVehicleComparisonLabel(input: BusinessCaseInput): string {
  const current = buildCurrentVehicleLabel(input.current) || "Current vehicle";
  const selected =
    input.replacements.find((v) => v.id === input.selectedReplacementId) ?? input.replacements[0];
  const replacement = selected?.name?.trim() || "Replacement vehicle";
  return `${current} → ${replacement}`;
}

export function autoCaseNameFromCurrent(current: BusinessCaseInput["current"]): string | null {
  const name = buildCurrentVehicleLabel(current);
  return name.length > 0 ? name : null;
}

export function shouldAutoUpdateCaseName(
  caseName: string,
  previousCurrent: BusinessCaseInput["current"],
  nextCurrent: BusinessCaseInput["current"]
): boolean {
  const prevAuto = autoCaseNameFromCurrent(previousCurrent);
  const nextAuto = autoCaseNameFromCurrent(nextCurrent);
  if (!nextAuto) return false;
  return (
    caseName === "New comparison" ||
    !caseName.trim() ||
    (!!prevAuto && caseName === prevAuto)
  );
}
