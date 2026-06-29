import { describe, expect, it } from "vitest";
import { buildReplacementMarketQuery } from "@/lib/market/query-from-case";

describe("market query from case", () => {
  it("combines manufacturer and model for lookup", () => {
    expect(
      buildReplacementMarketQuery({ manufacturer: "BYD", name: "Shark 6" })
    ).toBe("BYD Shark 6");
  });

  it("avoids duplicating manufacturer in query", () => {
    expect(
      buildReplacementMarketQuery({ manufacturer: "BYD", name: "BYD Shark 6" })
    ).toBe("BYD Shark 6");
  });
});
