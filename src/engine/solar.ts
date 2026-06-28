import type { SolarConfig, SolarResult } from "./types";

export function calculateSolar(
  config: SolarConfig,
  evEnergyKwhAnnual: number,
  baselineFuelCost: number,
  overrides?: { solarPercent?: number; gridPercent?: number; electricityTariff?: number }
): SolarResult {
  const solarPercent = overrides?.solarPercent ?? config.solarChargingPercent;
  const gridPercent = overrides?.gridPercent ?? config.gridChargingPercent;
  const tariff = overrides?.electricityTariff ?? config.electricityTariff;

  const solarContributionKwh = evEnergyKwhAnnual * (solarPercent / 100);
  const gridKwhPurchased = evEnergyKwhAnnual * (gridPercent / 100);
  const annualChargingCost = gridKwhPurchased * tariff;
  const tenYearChargingCost = annualChargingCost * 10;
  const fuelSavingsVsBaseline = Math.max(0, baselineFuelCost - annualChargingCost);

  const solarContributionPercent =
    evEnergyKwhAnnual > 0 ? (solarContributionKwh / evEnergyKwhAnnual) * 100 : 0;

  return {
    gridKwhPurchased,
    solarContributionKwh: solarContributionKwh,
    solarContributionPercent,
    annualChargingCost,
    tenYearChargingCost,
    fuelSavingsVsBaseline,
    visual: {
      solarPanels: config.systemSizeKw,
      battery: config.batterySizeKwh,
      vehicle: evEnergyKwhAnnual,
      moneySaved: fuelSavingsVsBaseline,
    },
  };
}
