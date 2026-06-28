import { calculateFinance } from "./finance";
import { calculateTradeIn } from "./trade-in";
import { calculateRunningCosts } from "./running-costs";
import { calculateSolar } from "./solar";
import { calculateOwnership } from "./ownership";
import { analyzeRisk } from "./risk";
import { calculateKpis } from "./comparison";
import { buildChartSeries } from "./charts";
import { runDecisionIntelligence } from "./decision";
import type { BusinessCaseInput, BusinessCaseResult } from "./types";

function applyWhatIf(input: BusinessCaseInput) {
  const w = input.whatIf ?? {};
  const current = {
    ...input.current,
    currentValue: w.tradeValue ?? input.current.currentValue,
    outstandingFinance: w.outstandingFinance ?? input.current.outstandingFinance,
    maintenance: w.maintenance ?? input.current.maintenance,
    insurance: w.insurance ?? input.current.insurance,
  };
  const assumptions = {
    ...input.assumptions,
    dailyDistanceKm: w.dailyDistanceKm ?? input.assumptions.dailyDistanceKm,
    fuelPricePerLitre: w.fuelPricePerLitre ?? input.assumptions.fuelPricePerLitre,
    electricityTariff: w.electricityTariff ?? input.assumptions.electricityTariff,
  };
  const solar = {
    ...input.solar,
    solarChargingPercent: w.solarPercent ?? input.solar.solarChargingPercent,
    gridChargingPercent: w.gridPercent ?? input.solar.gridChargingPercent,
  };
  const replacements = input.replacements.map((v) =>
    v.id === input.selectedReplacementId
      ? {
          ...v,
          interestRate: w.interestRate ?? v.interestRate,
          deposit: w.deposit ?? v.deposit,
        }
      : v
  );
  return { current, assumptions, solar, replacements, w };
}

export function runFullBusinessCase(input: BusinessCaseInput): BusinessCaseResult {
  const { current, assumptions, solar, replacements, w } = applyWhatIf(input);
  const selected = replacements.find((v) => v.id === input.selectedReplacementId) ?? replacements[0];

  const tradeIn = calculateTradeIn(current, input.tradeIn, selected, {
    tradeValue: w.tradeValue,
    outstandingFinance: w.outstandingFinance,
  });

  const finance = calculateFinance(replacements, tradeIn, {
    interestRate: w.interestRate,
    deposit: w.deposit,
  });

  const running = calculateRunningCosts(
    current,
    replacements,
    assumptions,
    solar.solarChargingPercent,
    solar.gridChargingPercent,
    {
      dailyDistanceKm: w.dailyDistanceKm,
      fuelPricePerLitre: w.fuelPricePerLitre,
      electricityTariff: w.electricityTariff,
      maintenance: w.maintenance,
      insurance: w.insurance,
    }
  );

  const solarResult = calculateSolar(
    solar,
    running.evEnergyKwhAnnual,
    running.current.fuel,
    {
      solarPercent: w.solarPercent,
      gridPercent: w.gridPercent,
      electricityTariff: w.electricityTariff,
    }
  );

  const replacementResales = Object.fromEntries(
    replacements.map((v) => [v.id, v.expectedResale])
  );

  const selectedFinance = finance.find((f) => f.vehicleId === selected?.id);

  const ownership = calculateOwnership(
    running.current,
    running.replacements,
    finance,
    current.residualValue,
    replacementResales,
    assumptions.dailyDistanceKm
  );

  const risk = analyzeRisk(current, replacements);
  const kpis = calculateKpis(
    { ...input, current, replacements, assumptions, solar },
    finance,
    running,
    solarResult,
    ownership
  );
  const decision = runDecisionIntelligence(
    { ...input, current, replacements, assumptions, solar },
    kpis,
    tradeIn,
    running,
    solarResult,
    ownership,
    risk
  );
  const charts = buildChartSeries(
    finance,
    running,
    ownership,
    selected?.id ?? "",
    selectedFinance
  );

  return {
    tradeIn,
    finance,
    running,
    solar: solarResult,
    ownership,
    risk,
    kpis,
    recommendation: decision.executiveRecommendation,
    charts,
    decision,
  };
}

export * from "./types";
export { calculateFinance, calculateMonthlyPayment } from "./finance";
export { calculateTradeIn } from "./trade-in";
export { calculateRunningCosts } from "./running-costs";
export { calculateSolar } from "./solar";
export { calculateOwnership } from "./ownership";
export { analyzeRisk } from "./risk";
export { calculateKpis } from "./comparison";
export { generateRecommendation } from "./recommendation";
export { runDecisionIntelligence } from "./decision";
export { lookupNewVehicle, lookupTradeIn, buildMarketExecutiveSummary } from "./market";
