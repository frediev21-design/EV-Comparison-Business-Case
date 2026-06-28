import type { BusinessCaseInput } from "@/engine/types";

/** What-If overrides are session-only and must not persist or affect setup steps. */
export function snapshotForSave(input: BusinessCaseInput): BusinessCaseInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip session-only what-if
  const { whatIf, ...rest } = input;
  return rest;
}

export function inputForLoad(input: BusinessCaseInput): BusinessCaseInput {
  const cleaned = snapshotForSave(input);
  const selected = cleaned.replacements.find((v) => v.id === cleaned.selectedReplacementId);
  const legacyVehicleDeposit = selected?.deposit ?? 0;
  const additionalCashDeposit =
    (cleaned.tradeIn?.additionalCashDeposit ?? 0) + legacyVehicleDeposit;

  const replacements =
    legacyVehicleDeposit > 0
      ? cleaned.replacements.map((v) =>
          v.id === cleaned.selectedReplacementId ? { ...v, deposit: 0 } : v
        )
      : cleaned.replacements;

  return {
    ...cleaned,
    tradeIn: { additionalCashDeposit },
    replacements,
  };
}
