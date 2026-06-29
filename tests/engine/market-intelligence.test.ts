import { describe, it, expect } from "vitest";
import { lookupNewVehicle, lookupTradeIn } from "@/engine/market";

describe("SA market intelligence", () => {
  it("looks up BYD Shark 6 pricing", () => {
    const result = lookupNewVehicle("BYD Shark 6");
    expect(result).not.toBeNull();
    expect(result!.manufacturer).toBe("BYD");
    expect(result!.averageDealerPrice).toBeGreaterThan(900000);
    expect(result!.sourceCount).toBeGreaterThanOrEqual(4);
    expect(result!.confidenceScore).toBeGreaterThan(50);
  });

  it("looks up Jetour by partial brand name", () => {
    const result = lookupNewVehicle("jetour");
    expect(result).not.toBeNull();
    expect(result!.manufacturer).toBe("Jetour");
    expect(result!.averageDealerPrice).toBeGreaterThan(400000);
  });

  it("finds Jetour T1 i-DM instead of Dashing when model is specified", () => {
    const result = lookupNewVehicle("Jetour T1 i-DM new");
    expect(result).not.toBeNull();
    expect(result!.model).toBe("T1 i-DM");
    expect(result!.retailPrice).toBe(689900);
  });

  it("does not match Dashing for T1 i-DM query", () => {
    const result = lookupNewVehicle("Jetour T1 i-DM");
    expect(result?.model).not.toBe("Dashing");
  });

  it("provides negotiation advice when above market", () => {
    const result = lookupNewVehicle("BYD Shark 6", 1010000);
    expect(result!.negotiationAdvice).toContain("above market");
    expect(result!.marketRating).toBe("overpriced");
  });

  it("values Ford Wildtrak trade-in", () => {
    const result = lookupTradeIn({
      manufacturer: "Ford",
      model: "Ranger Wildtrak Bi-Turbo",
      year: 2021,
      mileage: 85000,
      condition: "good",
      serviceHistory: true,
      accidentHistory: false,
      province: "Gauteng",
    });
    expect(result).not.toBeNull();
    expect(result!.tradeInValue).toBeGreaterThan(300000);
    expect(result!.privateSale).toBeGreaterThan(result!.tradeInValue);
    expect(result!.futureResale).toHaveLength(4);
  });

  it("adjusts valuation by condition", () => {
    const good = lookupTradeIn({
      manufacturer: "Ford",
      model: "Wildtrak",
      year: 2021,
      mileage: 85000,
      condition: "good",
      serviceHistory: true,
      accidentHistory: false,
    });
    const poor = lookupTradeIn({
      manufacturer: "Ford",
      model: "Wildtrak",
      year: 2021,
      mileage: 85000,
      condition: "poor",
      serviceHistory: false,
      accidentHistory: true,
    });
    expect(good!.tradeInValue).toBeGreaterThan(poor!.tradeInValue);
  });

  it("matches Wildtrak from split manufacturer and model fields", () => {
    const result = lookupTradeIn({
      manufacturer: "Ford",
      model: "Wildtrak Bi-Turbo",
      year: 2023,
      mileage: 36000,
      condition: "good",
      serviceHistory: true,
      accidentHistory: false,
    });
    expect(result).not.toBeNull();
    expect(result!.confidenceScore).toBeGreaterThan(50);
  });

  it("looks up replacement from short model name", () => {
    const result = lookupNewVehicle("Shark 6");
    expect(result?.model).toBe("Shark 6");
  });
});
