import { describe, expect, it } from "vitest";
import {
  DEALER_PROFILES,
  getDealerProfile,
  getVehiclePresetsForDealer,
} from "@/config/dealers/profiles";
import { VEHICLE_PRESETS } from "@/store/defaults";
import { getExportBranding } from "@/lib/dealer-store";

describe("dealer profiles", () => {
  it("includes demo dealer profiles with stock lists", () => {
    expect(DEALER_PROFILES.length).toBeGreaterThanOrEqual(3);
    for (const profile of DEALER_PROFILES) {
      expect(profile.vehiclePresets.length).toBeGreaterThan(0);
    }
  });

  it("returns full catalog when no dealer is selected", () => {
    expect(getVehiclePresetsForDealer(null)).toEqual(VEHICLE_PRESETS);
  });

  it("returns dealer-specific presets for byd-centurion", () => {
    const presets = getVehiclePresetsForDealer("byd-centurion");
    expect(presets.every((p) => p.manufacturer === "BYD")).toBe(true);
    expect(getDealerProfile("byd-centurion")?.name).toBe("BYD Centurion");
  });

  it("export branding includes Prodexa360 and prodexa.com", () => {
    const branding = getExportBranding();
    expect(branding.appName).toBe("SwitchSave");
    expect(branding.developerName).toBe("Prodexa360");
    expect(branding.developerUrl).toBe("https://www.prodexa.com");
  });
});
