import type { CurrentVehicle, ReplacementVehicle, RiskFlag, RiskResult } from "./types";

export function analyzeCurrentVehicleRisk(current: CurrentVehicle): RiskFlag[] {
  const currentYear = new Date().getFullYear();
  const age = currentYear - current.year;
  const flags: RiskFlag[] = [];

  flags.push({
    id: "high-mileage",
    label: "High Mileage Risk",
    level: current.mileage > 150000 ? "high" : current.mileage > 100000 ? "medium" : "low",
    description:
      current.mileage > 150000
        ? "Vehicle exceeds 150,000 km — elevated component wear expected."
        : "Mileage within typical operating range.",
  });

  if (current.hasTurbo) {
    flags.push({
      id: "turbo",
      label: "Turbo Risk",
      level: age > 5 ? "high" : "medium",
      description: "Turbocharged engine may require costly maintenance as vehicle ages.",
    });
  }

  if (current.hasDpf) {
    flags.push({
      id: "dpf",
      label: "DPF Risk",
      level: current.fuelType === "diesel" ? "high" : "medium",
      description: "Diesel particulate filter replacement or cleaning may be required.",
    });
  }

  flags.push({
    id: "injector",
    label: "Injector Risk",
    level: current.fuelType === "diesel" && age > 4 ? "high" : "medium",
    description: "Fuel injectors may require servicing on high-mileage diesel engines.",
  });

  flags.push({
    id: "gearbox",
    label: "Gearbox Risk",
    level: current.mileage > 120000 ? "high" : "low",
    description: "Automatic gearbox service intervals become critical at higher mileage.",
  });

  flags.push({
    id: "engine",
    label: "Engine Risk",
    level: age > 8 || current.mileage > 180000 ? "high" : "medium",
    description: "Engine reliability decreases with age and cumulative mileage.",
  });

  flags.push({
    id: "warranty",
    label: "Warranty Expired",
    level: current.warrantyExpired ? "high" : "positive",
    description: current.warrantyExpired
      ? "Manufacturer warranty has expired — repair costs are owner responsibility."
      : "Vehicle may still be under manufacturer warranty.",
  });

  return flags;
}

export function analyzeReplacementRisk(vehicle: ReplacementVehicle): RiskFlag[] {
  const flags: RiskFlag[] = [];

  flags.push({
    id: "battery-warranty",
    label: "Battery Warranty",
    level: vehicle.batteryWarrantyYears >= 8 ? "positive" : "medium",
    description: `${vehicle.batteryWarrantyYears}-year battery warranty provides long-term protection.`,
  });

  flags.push({
    id: "vehicle-warranty",
    label: "Vehicle Warranty",
    level: vehicle.warrantyYears >= 5 ? "positive" : "medium",
    description: `${vehicle.warrantyYears}-year comprehensive vehicle warranty.`,
  });

  flags.push({
    id: "reduced-maintenance",
    label: "Reduced Maintenance",
    level: vehicle.fuelType === "electric" ? "positive" : "medium",
    description:
      vehicle.fuelType === "electric"
        ? "EV powertrain has fewer moving parts — lower scheduled maintenance."
        : "Hybrid/ICE maintenance costs apply but may be lower than aging diesel.",
  });

  flags.push({
    id: "predictable-costs",
    label: "Predictable Costs",
    level: "positive",
    description: "Fixed energy costs and warranty coverage enable more predictable budgeting.",
  });

  return flags;
}

export function analyzeRisk(
  current: CurrentVehicle,
  replacements: ReplacementVehicle[]
): RiskResult {
  const replacementMap: Record<string, RiskFlag[]> = {};
  for (const vehicle of replacements) {
    replacementMap[vehicle.id] = analyzeReplacementRisk(vehicle);
  }

  return {
    current: analyzeCurrentVehicleRisk(current),
    replacements: replacementMap,
  };
}
