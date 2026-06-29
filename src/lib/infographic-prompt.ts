import type { BusinessCaseInput, BusinessCaseResult } from "@/engine/types";
import { formatCurrency } from "./format";
import { isStepComplete } from "./wizard-validation";
import { buildCurrentVehicleLabel, buildVehicleComparisonLabel } from "./case-labels";
import { generateRecommendationSummary } from "./recommendation-summary";
import { APP_NAME } from "./brand";

export function isInfographicPromptReady(input: BusinessCaseInput): boolean {
  return (
    isStepComplete("current", input) &&
    isStepComplete("replacement", input) &&
    isStepComplete("trade-in", input)
  );
}

export function generateInfographicPrompt(
  input: BusinessCaseInput,
  result: BusinessCaseResult,
  caseName: string
): string {
  const { current, assumptions, solar } = input;
  const selected =
    input.replacements.find((v) => v.id === input.selectedReplacementId) ??
    input.replacements[0];
  const { kpis, tradeIn, decision, solar: solarResult } = result;
  const d = decision;

  const currentLabel = buildCurrentVehicleLabel(current) || "Current vehicle";
  const replacementLabel = selected?.name?.trim() || "Replacement vehicle";
  const comparisonLabel = buildVehicleComparisonLabel(input);
  const recommendationSummary = generateRecommendationSummary(input, result);
  const fleetNote =
    kpis.fleetVehicleCount > 1 ? `\nFleet size: ${kpis.fleetVehicleCount} identical vehicles` : "";

  return `Create a professional single-page infographic for a South African vehicle upgrade comparison. Use a clean, modern layout suitable for sharing with a customer or internal decision meeting.

## Brand & style
- Title: "${APP_NAME} — Upgrade Summary"
- Subtitle: "${comparisonLabel}"
- Colour palette: deep teal (#0f766e) as primary accent, white/light grey background, green for savings, amber for review, red only for negative outcomes
- Include subtle automotive / energy motifs (not clip-art heavy)
- Use South African Rand (R) formatting throughout
- Footer disclaimer (small): "Estimates only — not financial advice. Verify with your finance provider."

## Layout structure (top to bottom)
1. **Header strip**: "${comparisonLabel}" with decision badge "${d.trafficLight.label}" and investment score ${d.investmentScore.total}/100 (${d.investmentScore.rating})
2. **Hero KPI row** (3 large numbers):
   - Monthly saving: ${formatCurrency(kpis.monthlySaving)}/month
   - Amount to finance: ${formatCurrency(tradeIn.amountFinanced)}
   - 10-year saving: ${formatCurrency(kpis.tenYearSaving)}
3. **Side-by-side comparison** (two columns):
   | | Current | Replacement |
   | Monthly repayment | ${formatCurrency(kpis.currentFinanceInstalment)} | ${formatCurrency(kpis.replacementFinanceInstalment)} |
   | Monthly total cost | ${formatCurrency(kpis.currentMonthlyCost)} | ${formatCurrency(kpis.replacementMonthlyCost)} |
   | Fuel type | ${current.fuelType} | ${selected?.fuelType ?? "—"} |
4. **Trade-in waterfall** (simple visual flow):
   - Current value ${formatCurrency(tradeIn.currentVehicleValue)} → minus finance ${formatCurrency(tradeIn.outstandingFinance)} → trade equity ${formatCurrency(tradeIn.tradeEquity)} → plus cash deposit ${formatCurrency(tradeIn.additionalCash)} → total deposit ${formatCurrency(tradeIn.totalDeposit)} → vehicle price ${formatCurrency(tradeIn.vehiclePrice)} → **finance ${formatCurrency(tradeIn.amountFinanced)}**
5. **Mini chart suggestions** (draw as simplified visuals, not raw data tables):
   - Monthly cash flow: current vs replacement bars for 12 months trend
   - Fuel vs electricity cost shift
   - Solar contribution: ${solarResult.solarContributionPercent.toFixed(0)}% of charging from ${solar.systemSizeKw} kW solar
6. **Recommendation callout box** — render this exact summary block prominently:
${recommendationSummary.split("\n").map((line) => `   ${line}`).join("\n")}
7. **Executive narrative** (smaller text below the callout):
   "${d.executiveRecommendation}"
8. **SWOT snapshot** (2×2 grid, bullet points only):
   - Strengths: ${d.swot.strengths.slice(0, 3).join("; ")}
   - Weaknesses: ${d.swot.weaknesses.slice(0, 2).join("; ")}
   - Opportunities: ${d.swot.opportunities.slice(0, 2).join("; ")}
   - Threats: ${d.swot.threats.slice(0, 2).join("; ")}

## Source data (for accuracy — do not render as a raw table)
Scenario: ${caseName} · ${comparisonLabel}
Current vehicle: ${currentLabel} (${current.year}, ${current.mileage.toLocaleString()} km)
Replacement: ${replacementLabel} — ${formatCurrency(selected?.price ?? 0)} · ${selected?.financeTermMonths ?? 0} months @ ${selected?.interestRate ?? 0}%
Daily distance: ${assumptions.dailyDistanceKm} km/day · Fuel R${assumptions.fuelPricePerLitre}/L · Electricity R${assumptions.electricityTariff}/kWh
Annual saving: ${formatCurrency(kpis.annualSaving)} · Payback: ${kpis.paybackMonths > 0 ? `${kpis.paybackMonths} months` : "N/A"} · ROI context: operating saving ${formatCurrency(kpis.operatingMonthlySaving)}/mo, finance delta ${formatCurrency(kpis.financeMonthlyDelta)}/mo${fleetNote}

## Output instructions
- Produce a polished infographic image (portrait A4 or 1080×1350 social format)
- Priorise clarity for a non-technical fleet manager or business owner
- Highlight the monthly saving and decision traffic light prominently
- Keep text legible at a glance — avoid dense paragraphs
`.trim();
}

export async function copyInfographicPrompt(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  throw new Error("Clipboard not available");
}

export function chatGptUrl(): string {
  return "https://chatgpt.com/";
}
