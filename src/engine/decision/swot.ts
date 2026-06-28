import type { BusinessCaseInput, ComparisonKpis, SolarResult, TradeInResult } from "../types";
import type { SwotAnalysis } from "./types";

export function generateSwot(
  input: BusinessCaseInput,
  kpis: ComparisonKpis,
  solar: SolarResult,
  tradeIn: TradeInResult
): SwotAnalysis {
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
  const current = input.current;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const threats: string[] = [];

  if (kpis.monthlySaving > 0) strengths.push("Lower running costs vs current vehicle");
  if (selected && selected.batteryWarrantyYears >= 8) strengths.push("Strong battery warranty protection");
  if (solar.solarContributionPercent >= 50) strengths.push("Solar-assisted charging reduces energy costs");
  if (selected?.fuelType === "electric" || selected?.fuelType === "phev") {
    strengths.push("Advanced powertrain technology");
  }
  if (tradeIn.tradeEquity > 0) strengths.push(`R${tradeIn.tradeEquity.toLocaleString()} trade equity reduces finance exposure`);

  if (selected && selected.price > current.currentValue) {
    weaknesses.push("Higher purchase price than current vehicle value");
  }
  if (tradeIn.amountFinanced > 300000) {
    weaknesses.push("Significant finance commitment over loan term");
  }
  if (kpis.monthlySaving < 0) weaknesses.push("Higher monthly cash flow vs current vehicle");

  opportunities.push("Rising fuel prices improve EV/PHEV economics over time");
  if (selected && selected.expectedResale > 0) {
    opportunities.push("Strong expected resale supports total cost of ownership");
  }
  opportunities.push("Lower maintenance intervals reduce downtime and service costs");
  if (input.assumptions.dailyDistanceKm > 80) {
    opportunities.push("High daily mileage amplifies per-km savings");
  }

  threats.push("Interest rate increases raise finance costs");
  if (selected?.fuelType === "electric") {
    threats.push("Battery technology changes may affect long-term resale values");
  }
  if (current.mileage > 100000 && !current.warrantyExpired) {
    threats.push("Delaying replacement exposes fleet to escalating repair costs");
  }

  return {
    strengths: strengths.length ? strengths : ["Comparable operating profile to current vehicle"],
    weaknesses: weaknesses.length ? weaknesses : ["Standard capital investment considerations apply"],
    opportunities: opportunities.length ? opportunities : ["Monitor market conditions for optimal timing"],
    threats: threats.length ? threats : ["Macroeconomic factors may affect assumptions"],
  };
}
