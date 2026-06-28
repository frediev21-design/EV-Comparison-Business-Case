import type { BusinessCaseInput, ComparisonKpis, SolarResult, TradeInResult } from "./types";

export function generateRecommendation(
  input: BusinessCaseInput,
  kpis: ComparisonKpis,
  solar: SolarResult,
  tradeIn: TradeInResult
): string {
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
  if (!selected) {
    return "Add a replacement vehicle to generate an executive recommendation.";
  }

  const savingDirection = kpis.monthlySaving >= 0 ? "reduces" : "increases";
  const absMonthly = Math.abs(kpis.monthlySaving).toLocaleString("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  });

  const solarNote =
    input.solar.systemSizeKw > 0
      ? ` The combination of trade equity, additional cash deposit, and a ${input.solar.systemSizeKw}kW solar installation results in a manageable finance balance and substantially lower running costs over the ownership period.`
      : "";

  const warrantyNote =
    kpis.batteryWarrantyRemainingYears >= 8
      ? " Strong battery warranty protection further de-risks the investment."
      : "";

  return `Based on the assumptions entered, upgrading to the ${selected.name} ${savingDirection} long-term operating costs by approximately ${absMonthly} per month while providing predictable ownership expenses, warranty protection, and significantly lower dependence on ${input.current.fuelType === "diesel" ? "diesel" : "fossil fuels"}. Trade equity of R${tradeIn.tradeEquity.toLocaleString()} combined with R${tradeIn.additionalCash.toLocaleString()} additional deposit leaves R${tradeIn.amountFinanced.toLocaleString()} to finance at ${selected.interestRate}% over ${selected.financeTermMonths} months.${solarNote}${warrantyNote} Over 10 years, projected savings total R${Math.abs(kpis.tenYearSaving).toLocaleString()}, with a payback period of ${kpis.paybackMonths > 0 ? `${kpis.paybackMonths} months` : "N/A"}.`;
}
