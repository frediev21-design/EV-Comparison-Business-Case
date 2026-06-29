import type { Assumptions, SolarConfig, SolarResult } from "./types";
import { splitEvChargingCost } from "./charging-cost";

export function calculateSolar(
  config: SolarConfig,
  assumptions: Assumptions,
  evEnergyKwhAnnual: number,
  baselineFuelCost: number,
  overrides?: { solarPercent?: number; gridPercent?: number; electricityTariff?: number }
): SolarResult {
  const solarPercent = overrides?.solarPercent ?? config.solarChargingPercent;
  const gridPercent = overrides?.gridPercent ?? config.gridChargingPercent;

  const charging = splitEvChargingCost(
    evEnergyKwhAnnual,
    solarPercent,
    gridPercent,
    config,
    assumptions,
    overrides?.electricityTariff
  );

  const annualChargingCost = charging.electricity;
  const tenYearChargingCost = annualChargingCost * 10;
  const fuelSavingsVsBaseline = Math.max(0, baselineFuelCost - annualChargingCost);

  const solarContributionPercent =
    evEnergyKwhAnnual > 0 ? (charging.solarKwh / evEnergyKwhAnnual) * 100 : 0;

  return {
    gridKwhPurchased: charging.gridKwh,
    solarContributionKwh: charging.solarKwh,
    solarContributionPercent,
    annualChargingCost,
    annualSolarAmortisation: charging.solar,
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

export { estimateSolarSystemCost } from "./charging-cost";
