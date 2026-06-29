import type {
  Assumptions,
  CurrentVehicle,
  ReplacementVehicle,
  RunningCostBreakdown,
  RunningCostResult,
  SolarConfig,
} from "./types";
import { splitEvChargingCost } from "./charging-cost";

const DEFAULT_PHEV_ELECTRIC_PERCENT = 50;

function annualKm(dailyKm: number): number {
  return dailyKm * 365;
}

function phevElectricShare(assumptions: Assumptions): number {
  const raw = assumptions.phevElectricPercent ?? DEFAULT_PHEV_ELECTRIC_PERCENT;
  return Math.min(100, Math.max(0, raw));
}

function buildBreakdown(
  fuel: number,
  electricity: number,
  solar: number,
  grid: number,
  maintenance: number,
  insurance: number,
  tyres: number,
  licence: number,
  repairs: number,
  servicePlans: number
): RunningCostBreakdown {
  const total =
    fuel + electricity + maintenance + insurance + tyres + licence + repairs + servicePlans;
  return {
    fuel,
    electricity,
    solar,
    grid,
    maintenance,
    insurance,
    tyres,
    licence,
    repairs,
    servicePlans,
    total,
  };
}

export function calculateCurrentRunningCosts(
  current: CurrentVehicle,
  assumptions: Assumptions,
  overrides?: Partial<
    Assumptions & { currentMaintenance?: number; maintenance?: number; insurance?: number }
  >
): RunningCostBreakdown {
  const dailyKm = overrides?.dailyDistanceKm ?? assumptions.dailyDistanceKm;
  const fuelPrice = overrides?.fuelPricePerLitre ?? assumptions.fuelPricePerLitre;
  const km = annualKm(dailyKm);
  const fuel =
    current.fuelType === "electric"
      ? 0
      : (km / 100) * current.fuelConsumption * fuelPrice;

  return buildBreakdown(
    fuel,
    0,
    0,
    0,
    overrides?.currentMaintenance ?? overrides?.maintenance ?? current.maintenance,
    overrides?.insurance ?? current.insurance,
    current.tyres,
    current.licence,
    current.expectedAnnualRepairs,
    0
  );
}

export function calculateReplacementRunningCosts(
  vehicle: ReplacementVehicle,
  assumptions: Assumptions,
  solar: SolarConfig,
  current: CurrentVehicle,
  overrides?: Partial<Assumptions & { maintenance?: number; insurance?: number }>
): { breakdown: RunningCostBreakdown; evEnergyKwh: number } {
  const dailyKm = overrides?.dailyDistanceKm ?? assumptions.dailyDistanceKm;
  const fuelPrice = overrides?.fuelPricePerLitre ?? assumptions.fuelPricePerLitre;
  const electricityOverride = overrides?.electricityTariff;
  const km = annualKm(dailyKm);
  const solarPercent = solar.solarChargingPercent;
  const gridPercent = solar.gridChargingPercent;

  let fuel = 0;
  let electricity = 0;
  let solarCost = 0;
  let gridCost = 0;
  let evEnergyKwh = 0;

  if (vehicle.fuelType === "electric") {
    evEnergyKwh = (km / 100) * vehicle.energyConsumption;
    const charging = splitEvChargingCost(
      evEnergyKwh,
      solarPercent,
      gridPercent,
      solar,
      assumptions,
      electricityOverride
    );
    gridCost = charging.grid;
    solarCost = charging.solar;
    electricity = charging.electricity;
  } else if (vehicle.fuelType === "phev") {
    const electricPercent = phevElectricShare(assumptions);
    const electricKm = km * (electricPercent / 100);
    const iceKm = km - electricKm;
    evEnergyKwh = (electricKm / 100) * vehicle.energyConsumption;
    const charging = splitEvChargingCost(
      evEnergyKwh,
      solarPercent,
      gridPercent,
      solar,
      assumptions,
      electricityOverride
    );
    gridCost = charging.grid;
    solarCost = charging.solar;
    electricity = charging.electricity;
    if (vehicle.fuelConsumption > 0 && iceKm > 0) {
      fuel = (iceKm / 100) * vehicle.fuelConsumption * fuelPrice;
    }
  } else if (vehicle.fuelType === "hybrid") {
    const iceKm = km * 0.4;
    const evKm = km * 0.6;
    fuel = (iceKm / 100) * vehicle.fuelConsumption * fuelPrice;
    evEnergyKwh = (evKm / 100) * vehicle.energyConsumption;
    const charging = splitEvChargingCost(
      evEnergyKwh,
      solarPercent,
      gridPercent,
      solar,
      assumptions,
      electricityOverride
    );
    gridCost = charging.grid;
    solarCost = charging.solar;
    electricity = charging.electricity;
  } else {
    fuel = (km / 100) * vehicle.fuelConsumption * fuelPrice;
  }

  const tyres =
    current.tyres > 0 ? current.tyres : Math.round(vehicle.price * 0.008);
  const licence = current.licence > 0 ? current.licence : 1200;
  const repairs = vehicle.expectedAnnualRepairs ?? 0;

  const breakdown = buildBreakdown(
    fuel,
    electricity,
    solarCost,
    gridCost,
    overrides?.maintenance ?? vehicle.maintenance,
    overrides?.insurance ?? vehicle.insurance,
    tyres,
    licence,
    repairs,
    0
  );

  return { breakdown, evEnergyKwh };
}

export function calculateRunningCosts(
  current: CurrentVehicle,
  replacements: ReplacementVehicle[],
  assumptions: Assumptions,
  solar: SolarConfig,
  overrides?: Partial<
    Assumptions & { currentMaintenance?: number; maintenance?: number; insurance?: number }
  >
): RunningCostResult {
  const currentBreakdown = calculateCurrentRunningCosts(current, assumptions, overrides);
  const replacementMap: Record<string, RunningCostBreakdown> = {};
  let totalEvEnergy = 0;

  for (const vehicle of replacements) {
    const { breakdown, evEnergyKwh } = calculateReplacementRunningCosts(
      vehicle,
      assumptions,
      solar,
      current,
      overrides
    );
    replacementMap[vehicle.id] = breakdown;
    totalEvEnergy += evEnergyKwh;
  }

  return {
    current: currentBreakdown,
    replacements: replacementMap,
    evEnergyKwhAnnual: totalEvEnergy,
  };
}
