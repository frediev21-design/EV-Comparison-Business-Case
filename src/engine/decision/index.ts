import type {
  BusinessCaseInput,
  ComparisonKpis,
  OwnershipResult,
  RiskResult,
  RunningCostResult,
  SolarResult,
  TradeInResult,
} from "../types";
import { calculateInvestmentScore, calculateTrafficLight, buildBoardSummary } from "./score";
import { buildRiskMatrix } from "./risk-matrix";
import { generateSwot } from "./swot";
import { buildDecisionTimeline } from "./timeline";
import { generateAdvisorTips } from "./advisor";
import type { DecisionIntelligence } from "./types";

export function generateExecutiveRecommendation(
  input: BusinessCaseInput,
  kpis: ComparisonKpis,
  solar: SolarResult,
  tradeIn: TradeInResult,
  score: number
): string {
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
  if (!selected) {
    return "Add a replacement vehicle to generate an executive recommendation.";
  }

  const advantageous = kpis.monthlySaving >= 0 && score >= 75;
  const tone = advantageous ? "financially advantageous" : "requires careful consideration";

  const solarPct = input.solar.solarChargingPercent;
  const solarNote =
    solarPct >= 50
      ? ` Together with ${solarPct}% solar charging, the vehicle delivers substantially lower operating costs`
      : "";

  return `Based on the current assumptions, purchasing the ${selected.name} is ${tone}. The combination of R${tradeIn.tradeEquity.toLocaleString()} trade equity and an additional R${tradeIn.additionalCash.toLocaleString()} cash deposit reduces the financed amount to R${tradeIn.amountFinanced.toLocaleString()}.${solarNote} and predictable ownership over the next ten years. Executive investment score: ${score}/100.`;
}

export function runDecisionIntelligence(
  input: BusinessCaseInput,
  kpis: ComparisonKpis,
  tradeIn: TradeInResult,
  running: RunningCostResult,
  solar: SolarResult,
  ownership: OwnershipResult,
  risk: RiskResult
): DecisionIntelligence {
  const investmentScore = calculateInvestmentScore(input, kpis, running, risk, tradeIn);
  const trafficLight = calculateTrafficLight(investmentScore.total, kpis);
  const executiveRecommendation = generateExecutiveRecommendation(
    input,
    kpis,
    solar,
    tradeIn,
    investmentScore.total
  );
  const boardSummary = buildBoardSummary(
    input,
    kpis,
    tradeIn,
    running,
    solar,
    ownership,
    executiveRecommendation
  );
  const riskMatrix = buildRiskMatrix(input, kpis, running, solar);
  const swot = generateSwot(input, kpis, solar, tradeIn);
  const timeline = buildDecisionTimeline(input);
  const advisorTips = generateAdvisorTips(
    input,
    kpis,
    solar,
    tradeIn,
    investmentScore
  );

  return {
    investmentScore,
    trafficLight,
    boardSummary,
    riskMatrix,
    swot,
    timeline,
    advisorTips,
    executiveRecommendation,
  };
}

export * from "./types";
export { renderStars, getScoreRating } from "./utils";
