import type { Assumptions, SolarConfig } from "./types";

const DEFAULT_COST_PER_KW = 14000;
const DEFAULT_AMORTISATION_YEARS = 10;
const DEFAULT_GRID_PEAK_PERCENT = 30;

export function estimateSolarSystemCost(config: SolarConfig): number {
  if (config.systemCost > 0) return config.systemCost;
  if (config.systemSizeKw <= 0) return 0;
  return Math.round(config.systemSizeKw * DEFAULT_COST_PER_KW);
}

export function blendedGridTariff(
  solar: SolarConfig,
  assumptions: Assumptions,
  electricityOverride?: number
): number {
  const base = electricityOverride ?? solar.electricityTariff ?? assumptions.electricityTariff;
  const peak = solar.peakTariff > 0 ? solar.peakTariff : base;
  const offPeak = solar.offPeakTariff > 0 ? solar.offPeakTariff : base;
  const peakShare = (solar.gridPeakPercent ?? DEFAULT_GRID_PEAK_PERCENT) / 100;
  return peak * peakShare + offPeak * (1 - peakShare);
}

export function amortisedSolarCostPerKwh(
  config: SolarConfig,
  annualSolarKwh: number
): number {
  if (annualSolarKwh <= 0 || config.solarChargingPercent <= 0) return 0;
  const systemCost = estimateSolarSystemCost(config);
  if (systemCost <= 0) return 0;
  const years = config.amortisationYears > 0 ? config.amortisationYears : DEFAULT_AMORTISATION_YEARS;
  return systemCost / years / annualSolarKwh;
}

export function splitEvChargingCost(
  evEnergyKwh: number,
  solarPercent: number,
  gridPercent: number,
  solar: SolarConfig,
  assumptions: Assumptions,
  electricityOverride?: number
): { grid: number; solar: number; electricity: number; gridKwh: number; solarKwh: number } {
  if (evEnergyKwh <= 0) {
    return { grid: 0, solar: 0, electricity: 0, gridKwh: 0, solarKwh: 0 };
  }

  const solarKwh = evEnergyKwh * (solarPercent / 100);
  const gridKwh = evEnergyKwh * (gridPercent / 100);
  const gridTariff = blendedGridTariff(solar, assumptions, electricityOverride);
  const solarPerKwh = amortisedSolarCostPerKwh(
    { ...solar, solarChargingPercent: solarPercent },
    solarKwh
  );
  const grid = gridKwh * gridTariff;
  const solarCost = solarKwh * solarPerKwh;

  return {
    grid,
    solar: solarCost,
    electricity: grid + solarCost,
    gridKwh,
    solarKwh,
  };
}
