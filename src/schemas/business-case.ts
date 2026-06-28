import { z } from "zod";

export const fuelTypeSchema = z.enum(["diesel", "petrol", "hybrid", "electric", "phev"]);

export const currentVehicleSchema = z.object({
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  year: z.number().min(1990).max(2030),
  mileage: z.number().min(0),
  currentValue: z.number().min(0),
  outstandingFinance: z.number().min(0),
  monthlyInstalment: z.number().min(0),
  fuelType: fuelTypeSchema,
  fuelConsumption: z.number().min(0),
  insurance: z.number().min(0),
  maintenance: z.number().min(0),
  tyres: z.number().min(0),
  licence: z.number().min(0),
  expectedAnnualRepairs: z.number().min(0),
  tradeInValue: z.number().min(0),
  residualValue: z.number().min(0),
  hasTurbo: z.boolean(),
  hasDpf: z.boolean(),
  warrantyExpired: z.boolean(),
});

export const replacementVehicleSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  manufacturer: z.string().min(1),
  price: z.number().min(0),
  deposit: z.number().min(0),
  interestRate: z.number().min(3).max(18),
  financeTermMonths: z.number().min(12).max(96),
  fuelType: fuelTypeSchema,
  batterySizeKwh: z.number().min(0),
  fuelConsumption: z.number().min(0),
  energyConsumption: z.number().min(0),
  warrantyYears: z.number().min(0),
  batteryWarrantyYears: z.number().min(0),
  maintenance: z.number().min(0),
  insurance: z.number().min(0),
  expectedResale: z.number().min(0),
});

export const tradeInSchema = z.object({
  additionalCashDeposit: z.number().min(0),
});

export const assumptionsSchema = z.object({
  dailyDistanceKm: z.number().min(10).max(300),
  fuelPricePerLitre: z.number().min(0),
  electricityTariff: z.number().min(0),
  peakTariff: z.number().min(0),
  offPeakTariff: z.number().min(0),
  annualKmGrowth: z.number().min(0).max(20),
  fleetVehicleCount: z.number().min(1).max(100),
});

export const solarConfigSchema = z.object({
  systemSizeKw: z.number().min(0),
  batterySizeKwh: z.number().min(0),
  solarChargingPercent: z.number().min(0).max(100),
  gridChargingPercent: z.number().min(0).max(100),
  electricityTariff: z.number().min(0),
  peakTariff: z.number().min(0),
  offPeakTariff: z.number().min(0),
});

export const whatIfSchema = z.object({
  dailyDistanceKm: z.number().min(10).max(300).optional(),
  fuelPricePerLitre: z.number().min(0).optional(),
  electricityTariff: z.number().min(0).optional(),
  interestRate: z.number().min(3).max(18).optional(),
  deposit: z.number().min(0).optional(),
  tradeValue: z.number().min(0).optional(),
  outstandingFinance: z.number().min(0).optional(),
  maintenance: z.number().min(0).optional(),
  insurance: z.number().min(0).optional(),
  solarPercent: z.number().min(0).max(100).optional(),
  gridPercent: z.number().min(0).max(100).optional(),
  fleetVehicleCount: z.number().min(1).max(100).optional(),
});

export const businessCaseInputSchema = z.object({
  type: z.literal("fleet-ev"),
  current: currentVehicleSchema,
  replacements: z.array(replacementVehicleSchema).min(1),
  tradeIn: tradeInSchema,
  assumptions: assumptionsSchema,
  solar: solarConfigSchema,
  selectedReplacementId: z.string(),
  whatIf: whatIfSchema.optional(),
});

export type CurrentVehicleInput = z.infer<typeof currentVehicleSchema>;
export type ReplacementVehicleInput = z.infer<typeof replacementVehicleSchema>;
export type BusinessCaseInputValidated = z.infer<typeof businessCaseInputSchema>;
