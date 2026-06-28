import type { WhatIfOverrides } from "@/engine/types";

export interface WhatIfPreset {
  id: string;
  label: string;
  description: string;
  overrides: WhatIfOverrides;
}

export const WHAT_IF_PRESETS: WhatIfPreset[] = [
  {
    id: "baseline",
    label: "Reset to base",
    description: "Clear all what-if overrides",
    overrides: {},
  },
  {
    id: "high-fuel",
    label: "High fuel",
    description: "R30/L diesel — stress test fuel costs",
    overrides: { fuelPricePerLitre: 30 },
  },
  {
    id: "no-solar",
    label: "No solar",
    description: "100% grid charging",
    overrides: { solarPercent: 0, gridPercent: 100 },
  },
  {
    id: "max-solar",
    label: "95% solar",
    description: "Near-zero grid charging",
    overrides: { solarPercent: 95, gridPercent: 5 },
  },
  {
    id: "high-km",
    label: "120 km/day",
    description: "Heavy daily use",
    overrides: { dailyDistanceKm: 120 },
  },
  {
    id: "worst-case",
    label: "Worst case",
    description: "High fuel, no solar, 120 km/day, R5/kWh",
    overrides: {
      fuelPricePerLitre: 30,
      electricityTariff: 5,
      solarPercent: 0,
      gridPercent: 100,
      dailyDistanceKm: 120,
    },
  },
];
