import { calculateFinance } from "./finance";
import { buildCurrentFinanceResult } from "./current-finance";
import { calculateTradeIn } from "./trade-in";
import { calculateRunningCosts } from "./running-costs";
import { calculateSolar } from "./solar";
import { calculateOwnership } from "./ownership";
import { analyzeRisk } from "./risk";
import { calculateKpis } from "./comparison";
import { buildChartSeries } from "./charts";
import {
  getFleetCount,
  scaleTradeInForFleet,
  scaleFinanceForFleet,
  scaleKpisForFleet,
  scaleCurrentRunningForFleet,
  scaleReplacementRunningForFleet,
  scaleOwnershipForFleet,
  scaleSolarForFleet,
} from "./fleet";
import { runDecisionIntelligence } from "./decision";
import type { BusinessCaseInput, BusinessCaseResult } from "./types";

function applyWhatIf(input: BusinessCaseInput) {
  const w = input.whatIf ?? {};
  const current = {
    ...input.current,
    maintenance: w.maintenance ?? input.current.maintenance,
    insurance: w.insurance ?? input.current.insurance,
  };
  const assumptions = {
    ...input.assumptions,
    dailyDistanceKm: w.dailyDistanceKm ?? input.assumptions.dailyDistanceKm,
    fuelPricePerLitre: w.fuelPricePerLitre ?? input.assumptions.fuelPricePerLitre,
    electricityTariff: w.electricityTariff ?? input.assumptions.electricityTariff,
    fleetVehicleCount: w.fleetVehicleCount ?? input.assumptions.fleetVehicleCount,
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
  const selectedBase =
    input.replacements.find((v) => v.id === input.selectedReplacementId) ?? input.replacements[0];

  const tradeIn = calculateTradeIn(input.current, input.tradeIn, selectedBase);

  const finance = calculateFinance(replacements, tradeIn, {
    interestRate: w.interestRate,
  });

  const running = calculateRunningCosts(
    current,
    replacements,
    assumptions,
    solar,
    {
      dailyDistanceKm: w.dailyDistanceKm,
      fuelPricePerLitre: w.fuelPricePerLitre,
      electricityTariff: w.electricityTariff,
      currentMaintenance: w.maintenance,
      insurance: w.insurance,
    }
  );

  const solarResult = calculateSolar(
    solar,
    assumptions,
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

  const currentFinance = buildCurrentFinanceResult(current);

  const ownership = calculateOwnership(
    running.current,
    running.replacements,
    finance,
    current.residualValue,
    replacementResales,
    assumptions.dailyDistanceKm,
    currentFinance,
    assumptions.annualKmGrowth ?? 0
  );

  const risk = analyzeRisk(current, replacements);
  const mergedInput = { ...input, current, replacements, assumptions, solar };
  let kpis = calculateKpis(
    mergedInput,
    finance,
    running,
    solarResult,
    ownership,
    currentFinance
  );
  kpis = { ...kpis, fleetVehicleCount: getFleetCount(assumptions, w) };

  const fleetCount = getFleetCount(assumptions, w);
  let scaledTradeIn = tradeIn;
  let scaledFinance = finance;
  let scaledRunning = running;
  let scaledSolar = solarResult;
  let scaledOwnership = ownership;

  if (fleetCount > 1) {
    scaledTradeIn = scaleTradeInForFleet(tradeIn, fleetCount);
    scaledFinance = scaleFinanceForFleet(finance, fleetCount);
    scaledRunning = {
      current: scaleCurrentRunningForFleet(running.current, fleetCount),
      replacements: scaleReplacementRunningForFleet(running.replacements, fleetCount),
      evEnergyKwhAnnual: running.evEnergyKwhAnnual * fleetCount,
    };
    scaledSolar = scaleSolarForFleet(solarResult, fleetCount);
    scaledOwnership = scaleOwnershipForFleet(ownership, fleetCount);
    kpis = scaleKpisForFleet(kpis, fleetCount);
    kpis.fleetVehicleCount = fleetCount;
  }

  const decision = runDecisionIntelligence(
    mergedInput,
    kpis,
    scaledTradeIn,
    scaledRunning,
    scaledSolar,
    scaledOwnership,
    risk
  );
  const charts = buildChartSeries(
    scaledFinance,
    scaledRunning,
    scaledOwnership,
    selected?.id ?? "",
    scaledFinance.find((f) => f.vehicleId === selected?.id)
  );

  return {
    tradeIn: scaledTradeIn,
    finance: scaledFinance,
    running: scaledRunning,
    solar: scaledSolar,
    ownership: scaledOwnership,
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
