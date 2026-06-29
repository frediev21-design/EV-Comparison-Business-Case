import type { DecisionIntelligence } from "./decision/types";

export type FuelType = "diesel" | "petrol" | "hybrid" | "electric" | "phev";
export type BusinessCaseType = "fleet-ev";

export interface CurrentVehicle {
  manufacturer: string;
  model: string;
  year: number;
  mileage: number;
  currentValue: number;
  outstandingFinance: number;
  monthlyInstalment: number;
  fuelType: FuelType;
  fuelConsumption: number;
  insurance: number;
  maintenance: number;
  tyres: number;
  licence: number;
  expectedAnnualRepairs: number;
  tradeInValue: number;
  residualValue: number;
  hasTurbo: boolean;
  hasDpf: boolean;
  warrantyExpired: boolean;
}

export interface ReplacementVehicle {
  id: string;
  name: string;
  manufacturer: string;
  price: number;
  deposit: number;
  interestRate: number;
  financeTermMonths: number;
  fuelType: FuelType;
  batterySizeKwh: number;
  fuelConsumption: number;
  energyConsumption: number;
  warrantyYears: number;
  batteryWarrantyYears: number;
  maintenance: number;
  insurance: number;
  expectedAnnualRepairs: number;
  expectedResale: number;
}

export interface TradeInInput {
  additionalCashDeposit: number;
}

export interface Assumptions {
  dailyDistanceKm: number;
  fuelPricePerLitre: number;
  electricityTariff: number;
  peakTariff: number;
  offPeakTariff: number;
  /** Share of PHEV distance on battery (0–100). Remainder uses ICE fuel consumption. */
  phevElectricPercent: number;
  /** Annual discount rate for NPV (e.g. 10.5 = 10.5%). */
  discountRate: number;
  annualKmGrowth: number;
  fleetVehicleCount: number;
}

export interface SolarConfig {
  systemSizeKw: number;
  batterySizeKwh: number;
  /** Total installed cost; 0 = estimate from system size. */
  systemCost: number;
  amortisationYears: number;
  /** Share of grid kWh charged at peak tariff (remainder at off-peak). */
  gridPeakPercent: number;
  solarChargingPercent: number;
  gridChargingPercent: number;
  electricityTariff: number;
  peakTariff: number;
  offPeakTariff: number;
}

export interface WhatIfOverrides {
  dailyDistanceKm?: number;
  fuelPricePerLitre?: number;
  electricityTariff?: number;
  interestRate?: number;
  deposit?: number;
  tradeValue?: number;
  outstandingFinance?: number;
  maintenance?: number;
  insurance?: number;
  solarPercent?: number;
  gridPercent?: number;
  fleetVehicleCount?: number;
}

export interface BusinessCaseInput {
  type: BusinessCaseType;
  current: CurrentVehicle;
  replacements: ReplacementVehicle[];
  tradeIn: TradeInInput;
  assumptions: Assumptions;
  solar: SolarConfig;
  selectedReplacementId: string;
  whatIf?: WhatIfOverrides;
}

export interface AmortisationRow {
  month: number;
  payment: number;
  interest: number;
  capital: number;
  balance: number;
}

export interface FinanceResult {
  vehicleId: string;
  vehicleName: string;
  amountFinanced: number;
  monthlyInstalment: number;
  totalInterest: number;
  totalPayments: number;
  schedule: AmortisationRow[];
}

export interface TradeInResult {
  currentVehicleValue: number;
  outstandingFinance: number;
  tradeEquity: number;
  additionalCash: number;
  totalDeposit: number;
  vehiclePrice: number;
  amountFinanced: number;
}

export interface RunningCostBreakdown {
  fuel: number;
  electricity: number;
  solar: number;
  grid: number;
  maintenance: number;
  insurance: number;
  tyres: number;
  licence: number;
  repairs: number;
  servicePlans: number;
  total: number;
}

export interface RunningCostResult {
  current: RunningCostBreakdown;
  replacements: Record<string, RunningCostBreakdown>;
  evEnergyKwhAnnual: number;
}

export interface SolarResult {
  gridKwhPurchased: number;
  solarContributionKwh: number;
  solarContributionPercent: number;
  annualChargingCost: number;
  annualSolarAmortisation: number;
  tenYearChargingCost: number;
  fuelSavingsVsBaseline: number;
  visual: {
    solarPanels: number;
    battery: number;
    vehicle: number;
    moneySaved: number;
  };
}

export interface OwnershipHorizon {
  years: number;
  monthlyCost: number;
  annualCost: number;
  totalCost: number;
  costPerKm: number;
  costPerDay: number;
  netOwnershipCost: number;
  ownershipAfterResale: number;
}

export interface OwnershipResult {
  current: OwnershipHorizon[];
  replacements: Record<string, OwnershipHorizon[]>;
}

export interface RiskFlag {
  id: string;
  label: string;
  level: "low" | "medium" | "high" | "positive";
  description: string;
}

export interface RiskResult {
  current: RiskFlag[];
  replacements: Record<string, RiskFlag[]>;
}

export interface ComparisonKpis {
  currentMonthlyCost: number;
  replacementMonthlyCost: number;
  currentFinanceInstalment: number;
  currentRunningMonthly: number;
  replacementFinanceInstalment: number;
  replacementRunningMonthly: number;
  operatingMonthlySaving: number;
  financeMonthlyDelta: number;
  monthlySaving: number;
  annualSaving: number;
  tenYearSaving: number;
  financeBalance: number;
  solarSaving: number;
  fuelSaving: number;
  costPerKmCurrent: number;
  costPerKmReplacement: number;
  /** @deprecated Use npv10Year — kept for legacy exports */
  roi: number;
  npv10Year: number;
  paybackMonths: number;
  batteryWarrantyRemainingYears: number;
  fleetVehicleCount: number;
}

export interface ChartDataPoint {
  label: string;
  current?: number;
  replacement?: number;
  value?: number;
  solar?: number;
  grid?: number;
  fuel?: number;
  electricity?: number;
  cumulative?: number;
  balance?: number;
  maintenance?: number;
  finance?: number;
}

export interface ChartSeries {
  monthlyCashFlow: ChartDataPoint[];
  fuelVsElectricity: ChartDataPoint[];
  financeBalance: ChartDataPoint[];
  ownershipCost: ChartDataPoint[];
  costPerKm: ChartDataPoint[];
  cumulativeSavings: ChartDataPoint[];
  tenYearTco: ChartDataPoint[];
  breakEven: ChartDataPoint[];
  solarContribution: ChartDataPoint[];
  maintenanceCosts: ChartDataPoint[];
}

export interface BusinessCaseResult {
  tradeIn: TradeInResult;
  finance: FinanceResult[];
  running: RunningCostResult;
  solar: SolarResult;
  ownership: OwnershipResult;
  risk: RiskResult;
  kpis: ComparisonKpis;
  recommendation: string;
  charts: ChartSeries;
  decision: DecisionIntelligence;
}

export type SavedWorkflowMode = "quick" | "full";

export interface ScenarioRecord {
  id: string;
  name: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  snapshot: BusinessCaseInput;
  /** Persisted wizard path — defaults to full for older saves. */
  workflowMode?: SavedWorkflowMode;
}
