import type { MarketSource } from "./types";

export function normalizeMarketQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\bi[\s-]*dm\b/gi, " idm ")
    .replace(/bi-turbo|biturbo|bi turbo|4x4|4×4|gd-6|gd6|phev|premium|luxury|extended range/gi, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const BRAND_ONLY_KEYS = new Set([
  "jetour",
  "byd",
  "ford",
  "toyota",
  "gwm",
  "chery",
  "tesla",
  "icaur",
  "mahindra",
]);

const QUERY_STOP_WORDS = new Set(["new", "used", "demo", "car", "vehicle", "price", "sa"]);

function significantQueryTokens(query: string): string[] {
  return normalizeMarketQuery(query)
    .split(" ")
    .filter((t) => t.length >= 2 && !QUERY_STOP_WORDS.has(t));
}

function scoreNewVehicleMatch(query: string, vehicle: CuratedNewVehicle): number {
  const q = normalizeMarketQuery(query);
  if (!q) return 0;

  const tokens = significantQueryTokens(query);
  const mfr = normalizeMarketQuery(vehicle.manufacturer);
  const modelTokens = tokens.filter((t) => t !== mfr);
  const modelHaystack = normalizeMarketQuery(
    `${vehicle.model} ${vehicle.variant} ${vehicle.keys.join(" ")}`
  );

  // User typed a model (e.g. T1) — require a model-specific token match, not brand alone.
  if (modelTokens.length > 0) {
    const hasModelToken = modelTokens.some(
      (t) =>
        modelHaystack.includes(t) ||
        vehicle.keys.some((k) => {
          const nk = normalizeMarketQuery(k);
          return nk.includes(t) || t.includes(nk);
        })
    );
    if (!hasModelToken) return 0;
  }

  const label = normalizeMarketQuery(`${vehicle.manufacturer} ${vehicle.model}`);
  let score = 0;
  if (q === label) score += 30;
  if (label.includes(q) || q.includes(label)) score += 15;
  for (const key of vehicle.keys) {
    const nk = normalizeMarketQuery(key);
    if (BRAND_ONLY_KEYS.has(nk) && modelTokens.length > 0) continue;
    if (q === nk) score += 25;
    if (nk.length >= 3 && (q.includes(nk) || nk.includes(q))) score += 10;
  }
  for (const t of modelTokens) {
    if (normalizeMarketQuery(vehicle.model).split(" ").includes(t)) score += 8;
    else if (modelHaystack.includes(t)) score += 6;
  }
  if (mfr && tokens.includes(mfr)) score += 3;
  return score;
}

function scoreUsedVehicleMatch(query: string, vehicle: CuratedUsedVehicle): number {
  const q = normalizeMarketQuery(query);
  if (!q) return 0;

  const label = normalizeMarketQuery(`${vehicle.manufacturer} ${vehicle.model}`);
  let score = 0;
  if (q === label) score += 25;
  if (label.includes(q) || q.includes(label)) score += 12;
  for (const key of vehicle.keys) {
    const nk = normalizeMarketQuery(key);
    if (q === nk) score += 20;
    if (q.includes(nk) || nk.includes(q)) score += 10;
  }
  const mfr = normalizeMarketQuery(vehicle.manufacturer);
  if (mfr && q.includes(mfr)) score += 3;
  for (const token of normalizeMarketQuery(vehicle.model).split(" ")) {
    if (token.length > 2 && q.includes(token)) score += 4;
  }
  return score;
}

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
    keys: ["jetour dashing", "dashing"],
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
    keys: ["jetour t2", "t2 2.0t", "jetour t2 2.0"],
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
  {
    keys: ["jetour t1 idm", "jetour t1", "t1 idm", "t1 i dm", "t1 idm phev"],
    manufacturer: "Jetour",
    model: "T1 i-DM",
    variant: "1.5T PHEV",
    retailPrice: 689900,
    sources: [
      { id: "cars", name: "Cars.co.za", price: 689900 },
      { id: "jetour", name: "Jetour SA", price: 689900 },
      { id: "topauto", name: "TopAuto", price: 689900 },
      { id: "autotrader", name: "AutoTrader", price: 699000 },
    ],
    promotions: ["7-year / 200,000 km warranty", "7-year / 75,000 km service plan"],
    financeOffers: ["72 months @ 11%"],
    deliveryCharges: 3500,
    dealerAvailability: "Available — 55+ Jetour dealers nationwide",
    listingsCount: 31,
    avgDaysOnMarket: 16,
    priceReductions: 1,
  },
  {
    keys: ["jetour t2 idm", "t2 idm", "t2 i dm", "t2 idm phev"],
    manufacturer: "Jetour",
    model: "T2 i-DM",
    variant: "1.5T PHEV",
    retailPrice: 779900,
    sources: [
      { id: "cars", name: "Cars.co.za", price: 779900 },
      { id: "jetour", name: "Jetour SA", price: 779900 },
      { id: "topauto", name: "TopAuto", price: 779900 },
    ],
    promotions: ["8-year / 160,000 km battery warranty"],
    financeOffers: ["72 months @ 11%"],
    deliveryCharges: 3500,
    dealerAvailability: "Available — major metros",
    listingsCount: 24,
    avgDaysOnMarket: 18,
    priceReductions: 0,
  },
  {
    keys: ["toyota hilux gr-s", "hilux gr-s", "hilux grs"],
    manufacturer: "Toyota",
    model: "Hilux GR-S",
    variant: "2.8 GD-6 4x4",
    retailPrice: 979900,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 989000 },
      { id: "cars", name: "Cars.co.za", price: 979900 },
      { id: "toyota", name: "Toyota SA", price: 979900 },
      { id: "motus", name: "Motus Toyota", price: 995000 },
    ],
    promotions: ["3-year service plan"],
    financeOffers: ["72 months @ 11.5%"],
    deliveryCharges: 4500,
    dealerAvailability: "Available",
    listingsCount: 72,
    avgDaysOnMarket: 18,
    priceReductions: 4,
  },
  {
    keys: ["gwm haval jolion", "haval jolion", "jolion"],
    manufacturer: "GWM",
    model: "Haval Jolion",
    variant: "1.5T Ultra Luxury",
    retailPrice: 449900,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 459000 },
      { id: "cars", name: "Cars.co.za", price: 449900 },
      { id: "gwm", name: "GWM SA", price: 449900 },
    ],
    promotions: ["5-year warranty"],
    financeOffers: ["72 months @ 10.75%"],
    deliveryCharges: 3000,
    dealerAvailability: "In stock",
    listingsCount: 55,
    avgDaysOnMarket: 16,
    priceReductions: 2,
  },
  {
    keys: ["chery omoda", "omoda", "chery omoda 5"],
    manufacturer: "Chery",
    model: "Omoda 5",
    variant: "C5 Luxury",
    retailPrice: 429900,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 439000 },
      { id: "cars", name: "Cars.co.za", price: 429900 },
      { id: "chery", name: "Chery SA", price: 429900 },
    ],
    promotions: ["7-year / 200,000 km warranty"],
    financeOffers: ["72 months @ 10.5%"],
    deliveryCharges: 3000,
    dealerAvailability: "Available",
    listingsCount: 48,
    avgDaysOnMarket: 19,
    priceReductions: 1,
  },
  {
    keys: ["byd seal", "seal"],
    manufacturer: "BYD",
    model: "Seal",
    variant: "Design AWD",
    retailPrice: 899900,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 909000 },
      { id: "cars", name: "Cars.co.za", price: 899900 },
      { id: "byd", name: "BYD Official", price: 899900 },
    ],
    promotions: [],
    financeOffers: ["72 months @ 10.5%"],
    deliveryCharges: 3500,
    dealerAvailability: "Order — 4–6 weeks",
    listingsCount: 28,
    avgDaysOnMarket: 22,
    priceReductions: 1,
  },
  {
    keys: ["ford ranger", "ranger xlt", "ranger"],
    manufacturer: "Ford",
    model: "Ranger",
    variant: "XLT 2.0 Bi-Turbo",
    retailPrice: 749900,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 759000 },
      { id: "cars", name: "Cars.co.za", price: 749900 },
      { id: "ford", name: "Ford SA", price: 749900 },
    ],
    promotions: [],
    financeOffers: ["72 months @ 11%"],
    deliveryCharges: 4500,
    dealerAvailability: "Available",
    listingsCount: 95,
    avgDaysOnMarket: 14,
    priceReductions: 3,
  },
  {
    keys: ["mahindra scorpio-n", "scorpio-n", "scorpio n"],
    manufacturer: "Mahindra",
    model: "Scorpio-N",
    variant: "Z8 4x4",
    retailPrice: 579900,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 589000 },
      { id: "cars", name: "Cars.co.za", price: 579900 },
      { id: "mahindra", name: "Mahindra SA", price: 579900 },
    ],
    promotions: [],
    financeOffers: ["72 months @ 11%"],
    deliveryCharges: 3500,
    dealerAvailability: "Available",
    listingsCount: 41,
    avgDaysOnMarket: 23,
    priceReductions: 2,
  },
];

/** Indicative curated dataset refresh — not live API pricing. */
export const MARKET_DATA_AS_OF = "June 2026";

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
  {
    keys: ["ford ranger", "ranger xlt", "ranger 2.0"],
    manufacturer: "Ford",
    model: "Ranger",
    baseYear: 2020,
    baseMileage: 90000,
    tradeInBase: 310000,
    privateSaleBase: 350000,
    dealerRetailBase: 389000,
    auctionBase: 285000,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 359000 },
      { id: "cars", name: "Cars.co.za", price: 352000 },
      { id: "webuycars", name: "WeBuyCars", price: 340000 },
    ],
    listingsCount: 98,
    avgDaysOnMarket: 26,
    priceReductions: 9,
    depreciationRateAnnual: 0.11,
  },
  {
    keys: ["toyota hilux gr-s", "hilux gr-s", "hilux grs"],
    manufacturer: "Toyota",
    model: "Hilux GR-S",
    baseYear: 2021,
    baseMileage: 75000,
    tradeInBase: 420000,
    privateSaleBase: 465000,
    dealerRetailBase: 515000,
    auctionBase: 390000,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 475000 },
      { id: "cars", name: "Cars.co.za", price: 469000 },
      { id: "motus", name: "Motus Used", price: 485000 },
    ],
    listingsCount: 34,
    avgDaysOnMarket: 24,
    priceReductions: 5,
    depreciationRateAnnual: 0.1,
  },
  {
    keys: ["byd shark", "shark 6 used"],
    manufacturer: "BYD",
    model: "Shark 6",
    baseYear: 2025,
    baseMileage: 15000,
    tradeInBase: 720000,
    privateSaleBase: 780000,
    dealerRetailBase: 840000,
    auctionBase: 680000,
    sources: [
      { id: "autotrader", name: "AutoTrader", price: 795000 },
      { id: "cars", name: "Cars.co.za", price: 785000 },
    ],
    listingsCount: 8,
    avgDaysOnMarket: 14,
    priceReductions: 0,
    depreciationRateAnnual: 0.14,
  },
];

export function findNewVehicle(query: string): CuratedNewVehicle | undefined {
  const q = query.trim();
  if (!q) return undefined;

  const ranked = CURATED_NEW_VEHICLES.map((vehicle) => ({
    vehicle,
    score: scoreNewVehicleMatch(q, vehicle),
  }))
    .filter((entry) => entry.score >= 8)
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.vehicle;
}

export function searchNewVehicles(query: string, limit = 6): CuratedNewVehicle[] {
  const q = query.trim();
  if (!q) return CURATED_NEW_VEHICLES.slice(0, limit);

  return CURATED_NEW_VEHICLES.map((vehicle) => ({
    vehicle,
    score: scoreNewVehicleMatch(q, vehicle),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.vehicle);
}

export function listNewVehicleLabels(): string[] {
  return CURATED_NEW_VEHICLES.map((v) => `${v.manufacturer} ${v.model}`);
}

export function findUsedVehicle(manufacturer: string, model: string): CuratedUsedVehicle | undefined {
  const q = `${manufacturer} ${model}`.trim();
  if (!q) return undefined;

  const ranked = CURATED_USED_VEHICLES.map((vehicle) => ({
    vehicle,
    score: scoreUsedVehicleMatch(q, vehicle),
  }))
    .filter((entry) => entry.score >= 8)
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.vehicle;
}
