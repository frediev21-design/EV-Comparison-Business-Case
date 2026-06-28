import { describe, it, expect } from "vitest";
import { createDefaultBusinessCase } from "@/store/defaults";
import { inputForLoad } from "@/lib/snapshot-sanitize";

describe("inputForLoad deposit merge", () => {
  it("merges legacy replacement deposit into additionalCashDeposit", () => {
    const input = createDefaultBusinessCase();
    input.tradeIn.additionalCashDeposit = 100000;
    input.replacements[0].deposit = 50000;

    const loaded = inputForLoad(input);

    expect(loaded.tradeIn.additionalCashDeposit).toBe(150000);
    expect(loaded.replacements[0].deposit).toBe(0);
  });
});
