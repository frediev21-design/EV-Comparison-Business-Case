import type { MarketSource } from "./types";

export interface CuratedNewVehicle {
  keys: string[];
  manufacturer: string;
  model: string;
  variant: string;
  retailPrice: number;
  sources: Omit<MarketSource, "lastSeen">[];
  promotions: string[];
  financeOffers: string[];
  deliveryCharges: number;
  dealerAvailability: string;
  listingsCount: number;
  avgDaysOnMarket: number;
  priceReductions: number;
}

export interface CuratedUsedVehicle {
  keys: string[];
  manufacturer: string;
  model: string;
  baseYear: number;
  baseMileage: number;
  tradeInBase: number;
  privateSaleBase: number;
  dealerRetailBase: number;
  auctionBase: number;
  sources: Omit<MarketSource, "lastSeen">[];
  listingsCount: number;
  avgDaysOnMarket: number;
  priceReductions: number;
  depreciationRateAnnual: number;
}

export const CURATED_NEW_VEHICLES: CuratedNewVehicle[] = [
  {
    keys: ["byd shark", "shark 6", "byd shark 6"],
    manufacturer: "BYD",
    model: "Shark 6",
    variant: "Premium PHEV",
    retailPrice: 959900,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 965000 },
      { id: "cars", name: "Cars.co.za", price: 959900 },
      { id: "byd", name: "BYD Official", price: 959900 },
      { id: "motus", name: "Motus BYD", price: 972000 },
      { id: "mccarthy", name: "McCarthy BYD", price: 985000 },
      { id: "cmh", name: "CMH BYD", price: 968000 },
    ],
    promotions: ["R15,000 launch discount (selected dealers)", "0% deposit finance available (T&Cs apply)"],
    financeOffers: ["72 months @ 10.5% (prime-linked)", "Balloon payment option up to 35%"],
    deliveryCharges: 3500,
    dealerAvailability: "Available — 2–4 week lead time (Gauteng, WC)",
    listingsCount: 47,
    avgDaysOnMarket: 18,
    priceReductions: 3,
  },
  {
    keys: ["byd dolphin", "dolphin"],
    manufacturer: "BYD",
    model: "Dolphin",
    variant: "Extended Range",
    retailPrice: 519900,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 525000 },
      { id: "cars", name: "Cars.co.za", price: 519900 },
      { id: "byd", name: "BYD Official", price: 519900 },
      { id: "motus", name: "Motus BYD", price: 529000 },
    ],
    promotions: ["Free home charger installation (promotional)"],
    financeOffers: ["72 months @ 10.25%"],
    deliveryCharges: 2500,
    dealerAvailability: "In stock — major metros",
    listingsCount: 62,
    avgDaysOnMarket: 12,
    priceReductions: 1,
  },
  {
    keys: ["icaur v23", "v23"],
    manufacturer: "iCAUR",
    model: "V23",
    variant: "Electric",
    retailPrice: 649900,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 655000 },
      { id: "cars", name: "Cars.co.za", price: 649900 },
      { id: "official", name: "iCAUR SA", price: 649900 },
    ],
    promotions: [],
    financeOffers: ["60 months @ 11%"],
    deliveryCharges: 3000,
    dealerAvailability: "Limited — pre-order",
    listingsCount: 18,
    avgDaysOnMarket: 25,
    priceReductions: 0,
  },
  {
    keys: ["tesla model 3", "model 3"],
    manufacturer: "Tesla",
    model: "Model 3",
    variant: "RWD",
    retailPrice: 849900,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 869000 },
      { id: "cars", name: "Cars.co.za", price: 849900 },
      { id: "tesla", name: "Tesla SA", price: 849900 },
    ],
    promotions: [],
    financeOffers: ["Tesla Finance — 72 months"],
    deliveryCharges: 0,
    dealerAvailability: "Order online",
    listingsCount: 34,
    avgDaysOnMarket: 22,
    priceReductions: 2,
  },
  {
    keys: ["ford ranger wildtrak", "wildtrak", "ranger wildtrak"],
    manufacturer: "Ford",
    model: "Ranger Wildtrak",
    variant: "Bi-Turbo 4x4",
    retailPrice: 929900,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 945000 },
      { id: "cars", name: "Cars.co.za", price: 929900 },
      { id: "ford", name: "Ford SA", price: 929900 },
      { id: "motus", name: "Motus Ford", price: 939000 },
      { id: "mccarthy", name: "McCarthy Ford", price: 952000 },
    ],
    promotions: ["Service plan inclusive (3 years)"],
    financeOffers: ["72 months @ 11.25%"],
    deliveryCharges: 4500,
    dealerAvailability: "Available",
    listingsCount: 89,
    avgDaysOnMarket: 15,
    priceReductions: 5,
  },
  {
    keys: ["jetour", "jetour dashing", "dashing"],
    manufacturer: "Jetour",
    model: "Dashing",
    variant: "1.5T Premium",
    retailPrice: 499900,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 509000 },
      { id: "cars", name: "Cars.co.za", price: 499900 },
      { id: "jetour", name: "Jetour SA", price: 499900 },
      { id: "motus", name: "Motus Jetour", price: 505000 },
    ],
    promotions: ["5-year / 150,000 km warranty (selected dealers)"],
    financeOffers: ["72 months @ 11%"],
    deliveryCharges: 3500,
    dealerAvailability: "Available — Gauteng, KZN, WC",
    listingsCount: 38,
    avgDaysOnMarket: 20,
    priceReductions: 2,
  },
  {
    keys: ["jetour t2", "t2"],
    manufacturer: "Jetour",
    model: "T2",
    variant: "2.0T Luxury",
    retailPrice: 649900,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 659000 },
      { id: "cars", name: "Cars.co.za", price: 649900 },
      { id: "jetour", name: "Jetour SA", price: 649900 },
    ],
    promotions: [],
    financeOffers: ["72 months @ 11%"],
    deliveryCharges: 3500,
    dealerAvailability: "Limited stock — major metros",
    listingsCount: 22,
    avgDaysOnMarket: 24,
    priceReductions: 1,
  },
];

export const CURATED_USED_VEHICLES: CuratedUsedVehicle[] = [
  {
    keys: ["ford wildtrak", "ford ranger wildtrak", "wildtrak bi-turbo", "ranger wildtrak"],
    manufacturer: "Ford",
    model: "Ranger Wildtrak Bi-Turbo",
    baseYear: 2021,
    baseMileage: 85000,
    tradeInBase: 340000,
    privateSaleBase: 385000,
    dealerRetailBase: 429000,
    auctionBase: 310000,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 395000 },
      { id: "cars", name: "Cars.co.za", price: 389000 },
      { id: "webuycars", name: "WeBuyCars", price: 375000 },
      { id: "mastercars", name: "MasterCars", price: 419000 },
      { id: "motus", name: "Motus Used", price: 405000 },
    ],
    listingsCount: 124,
    avgDaysOnMarket: 28,
    priceReductions: 12,
    depreciationRateAnnual: 0.12,
  },
  {
    keys: ["toyota hilux", "hilux"],
    manufacturer: "Toyota",
    model: "Hilux",
    baseYear: 2020,
    baseMileage: 90000,
    tradeInBase: 380000,
    privateSaleBase: 425000,
    dealerRetailBase: 469000,
    auctionBase: 350000,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 435000 },
      { id: "cars", name: "Cars.co.za", price: 429000 },
      { id: "webuycars", name: "WeBuyCars", price: 410000 },
    ],
    listingsCount: 156,
    avgDaysOnMarket: 21,
    priceReductions: 8,
    depreciationRateAnnual: 0.1,
  },
];

export function findNewVehicle(query: string): CuratedNewVehicle | undefined {
  const q = query.toLowerCase().trim();
  if (!q) return undefined;

  const exact = CURATED_NEW_VEHICLES.find((v) =>
    v.keys.some((k) => q === k || q === `${v.manufacturer} ${v.model}`.toLowerCase())
  );
  if (exact) return exact;

  return CURATED_NEW_VEHICLES.find((v) =>
    v.keys.some((k) => q.includes(k) || k.includes(q)) ||
    q.includes(v.manufacturer.toLowerCase()) ||
    q.includes(v.model.toLowerCase())
  );
}

export function searchNewVehicles(query: string, limit = 6): CuratedNewVehicle[] {
  const q = query.toLowerCase().trim();
  if (!q) return CURATED_NEW_VEHICLES.slice(0, limit);

  const scored = CURATED_NEW_VEHICLES.map((vehicle) => {
    const label = `${vehicle.manufacturer} ${vehicle.model}`.toLowerCase();
    let score = 0;
    if (label.includes(q) || q.includes(label)) score += 10;
    if (vehicle.manufacturer.toLowerCase().includes(q)) score += 8;
    if (vehicle.model.toLowerCase().includes(q)) score += 6;
    for (const key of vehicle.keys) {
      if (key.includes(q) || q.includes(key)) score += 5;
    }
    return { vehicle, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.vehicle);
}

export function listNewVehicleLabels(): string[] {
  return CURATED_NEW_VEHICLES.map((v) => `${v.manufacturer} ${v.model}`);
}

export function findUsedVehicle(manufacturer: string, model: string): CuratedUsedVehicle | undefined {
  const q = `${manufacturer} ${model}`.toLowerCase();
  return CURATED_USED_VEHICLES.find(
    (v) =>
      v.keys.some((k) => q.includes(k)) ||
      q.includes(v.manufacturer.toLowerCase()) ||
      q.includes(v.model.toLowerCase())
  );
}
