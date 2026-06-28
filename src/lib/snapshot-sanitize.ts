import type { BusinessCaseInput } from "@/engine/types";

/** What-If overrides are session-only and must not persist or affect setup steps. */
export function snapshotForSave(input: BusinessCaseInput): BusinessCaseInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip session-only what-if
  const { whatIf, ...rest } = input;
  return rest;
}

export function inputForLoad(input: BusinessCaseInput): BusinessCaseInput {
  return snapshotForSave(input);
}
