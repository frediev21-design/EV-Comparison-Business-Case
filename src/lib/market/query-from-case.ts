/** Normalise free-text vehicle names for SA market matching. */
export function normalizeMarketQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/bi-turbo|biturbo|bi turbo|4x4|4×4|gd-6|gd6|phev|premium|luxury|extended range/gi, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildReplacementMarketQuery(vehicle: {
  name: string;
  manufacturer: string;
}): string {
  const name = vehicle.name.trim();
  const manufacturer = vehicle.manufacturer.trim();
  if (!name && !manufacturer) return "";

  if (name && manufacturer && name.toLowerCase().startsWith(manufacturer.toLowerCase())) {
    return name;
  }
  if (name && manufacturer) {
    return `${manufacturer} ${name}`;
  }
  return name || manufacturer;
}

export function buildCurrentVehicleMarketLabel(current: {
  manufacturer: string;
  model: string;
}): string {
  return `${current.manufacturer} ${current.model}`.trim();
}
