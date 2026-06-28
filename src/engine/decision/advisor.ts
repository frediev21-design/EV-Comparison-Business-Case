import type { ComparisonKpis, SolarResult, TradeInResult } from "../types";
import type { AdvisorTip, InvestmentScore } from "./types";

export function generateAdvisorTips(
  input: import("../types").BusinessCaseInput,
  kpis: ComparisonKpis,
  solar: SolarResult,
  tradeIn: TradeInResult,
  score: InvestmentScore
): AdvisorTip[] {
  const tips: AdvisorTip[] = [];
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
  const current = input.current;
  const currentYear = new Date().getFullYear();
  const age = currentYear - current.year;

  if (selected && selected.interestRate >= 10) {
    tips.push({
      id: "rates",
      message:
        "Waiting six months may reduce financing costs if interest rates decline.",
      priority: "medium",
    });
  }

  if (tradeIn.amountFinanced > 0) {
    tips.push({
      id: "deposit",
      message: `You could reduce your monthly instalment by increasing your deposit by R50,000.`,
      priority: "high",
    });
  }

  if (input.assumptions.dailyDistanceKm >= 80) {
    tips.push({
      id: "mileage",
      message:
        "Driving more than 100 km/day significantly improves the EV business case.",
      priority: "high",
    });
  } else if (input.assumptions.dailyDistanceKm < 40) {
    tips.push({
      id: "low-mileage",
      message:
        "Low daily mileage reduces fuel savings — validate assumptions if usage increases.",
      priority: "medium",
    });
  }

  if (solar.solarContributionPercent >= 50) {
    tips.push({
      id: "solar",
      message: `Your existing solar system increases the investment score by reducing charging costs.`,
      priority: "high",
    });
  }

  if (age >= 4 || current.mileage > 100000) {
    tips.push({
      id: "wildtrak-risk",
      message: `The ${current.manufacturer} ${current.model} is entering a higher-risk maintenance phase based on its age and mileage.`,
      priority: "high",
    });
  }

  if (score.total >= 85 && kpis.paybackMonths > 0 && kpis.paybackMonths <= 36) {
    tips.push({
      id: "payback",
      message: `Payback within ${kpis.paybackMonths} months supports a strong investment case.`,
      priority: "medium",
    });
  }

  if (kpis.monthlySaving < 0) {
    tips.push({
      id: "negative-saving",
      message:
        "Monthly costs exceed the current vehicle — review finance term, deposit, or vehicle selection.",
      priority: "high",
    });
  }

  return tips.slice(0, 6);
}
