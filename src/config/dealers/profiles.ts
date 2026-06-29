import type { ReplacementVehicle } from "@/engine/types";
import { VEHICLE_PRESETS } from "@/store/defaults";

export type VehiclePreset = Omit<ReplacementVehicle, "id">;

export interface DealerProfile {
  id: string;
  name: string;
  tagline: string;
  region: string;
  brands: string[];
  /** Stock list shown as one-click presets in the replacement step */
  vehiclePresets: VehiclePreset[];
  /** Default finance desk rate when adding a preset vehicle */
  defaultInterestRate?: number;
}

function preset(name: string): VehiclePreset {
  const found = VEHICLE_PRESETS.find((p) => p.name === name);
  if (!found) throw new Error(`Unknown vehicle preset: ${name}`);
  return found;
}

/** Built-in demo dealer profiles — replace with real tenant config when Supabase is added. */
export const DEALER_PROFILES: DealerProfile[] = [
  {
    id: "byd-centurion",
    name: "BYD Centurion",
    tagline: "EV & PHEV specialist",
    region: "Gauteng",
    brands: ["BYD"],
    vehiclePresets: [preset("BYD Shark 6"), preset("BYD Dolphin")],
    defaultInterestRate: 10,
  },
  {
    id: "ev-motion",
    name: "EV Motion",
    tagline: "Multi-brand electric vehicles",
    region: "South Africa",
    brands: ["BYD", "iCAUR", "Tesla"],
    vehiclePresets: [
      preset("BYD Shark 6"),
      preset("BYD Dolphin"),
      preset("iCAUR V23"),
      preset("Tesla Model 3"),
    ],
    defaultInterestRate: 10.5,
  },
  {
    id: "phev-gallery",
    name: "PHEV Gallery",
    tagline: "Plug-in hybrid focus",
    region: "Western Cape",
    brands: ["BYD", "Toyota", "Ford"],
    vehiclePresets: [preset("BYD Shark 6"), preset("Toyota Hilux GR-S"), preset("Ford Ranger Wildtrak")],
    defaultInterestRate: 11,
  },
];

const profileMap = new Map(DEALER_PROFILES.map((p) => [p.id, p]));

export function getDealerProfile(id: string): DealerProfile | undefined {
  return profileMap.get(id);
}

export function getVehiclePresetsForDealer(dealerId: string | null): VehiclePreset[] {
  if (dealerId) {
    const profile = getDealerProfile(dealerId);
    if (profile) return profile.vehiclePresets;
  }
  return VEHICLE_PRESETS;
}
