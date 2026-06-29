import { describe, it, expect } from "vitest";
import { parseLocaleNumber } from "@/lib/parse-number";

describe("parseLocaleNumber", () => {
  it("parses comma decimals", () => {
    expect(parseLocaleNumber("7,5")).toBe(7.5);
    expect(parseLocaleNumber("29,6")).toBe(29.6);
  });

  it("parses dot decimals", () => {
    expect(parseLocaleNumber("7.5")).toBe(7.5);
  });
});
