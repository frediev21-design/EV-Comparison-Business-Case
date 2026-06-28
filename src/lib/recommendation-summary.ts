import type { BusinessCaseInput, BusinessCaseResult } from "@/engine/types";
import { formatCurrency } from "./format";
import { isInfographicPromptReady } from "./infographic-prompt";

export function getRecommendationHeadline(
  result: BusinessCaseResult
): string {
  const { decision, kpis } = result;
  const { trafficLight, investmentScore } = decision;

  if (trafficLight.status === "stop") return "Do Not Proceed";
  if (trafficLight.status === "go") return "Proceed with Replacement";
  if (kpis.monthlySaving >= 0 && investmentScore.total >= 70) return "Proceed with Replacement";
  return "Review Before Proceeding";
}

export function getRecommendationConfidence(score: number): "High" | "Medium" | "Low" {
  if (score >= 80) return "High";
  if (score >= 65) return "Medium";
  return "Low";
}

export function generateRecommendationSummary(
  _input: BusinessCaseInput,
  result: BusinessCaseResult
): string {
  const { decision, kpis } = result;
  const headline = getRecommendationHeadline(result);
  const confidence = getRecommendationConfidence(decision.investmentScore.total);
  const decisionLabel = decision.investmentScore.rating.toUpperCase();
  const divider = "-".repeat(60);

  return `${divider}
✓ RECOMMENDATION

${headline}

Investment Score
${decision.investmentScore.total} / 100

Expected Monthly Saving
${formatCurrency(kpis.monthlySaving)}

Confidence
${confidence}

Decision
${decisionLabel}
${divider}`.trim();
}

export function isRecommendationSummaryReady(input: BusinessCaseInput): boolean {
  return isInfographicPromptReady(input);
}

export async function copyRecommendationSummary(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  throw new Error("Clipboard not available");
}
