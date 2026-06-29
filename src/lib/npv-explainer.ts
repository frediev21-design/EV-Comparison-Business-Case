/** Plain-language copy — most buyers and sales staff won't know "NPV". */

export const NPV_DISCOUNT_RATE_LABEL = "Today's value rate";

export const NPV_DISCOUNT_RATE_HINT =
  "Money saved years from now is worth less than money saved today — like interest working in reverse. This rate (default 10.5%) controls how heavily we count future savings. Higher = more conservative. It powers the “Value of switching today” figure on your dashboard.";

export const NPV_KPI_TITLE = "Value of switching today";

export function npvKpiSubtitle(discountRatePercent: number): string {
  return `All 10-year savings in today's rands · ${discountRatePercent}% rate`;
}

export const NPV_KPI_HELP =
  "NPV (net present value) totals every saving and extra cost from switching, then converts future years into what they're worth right now — so you can compare fairly with today's deposit and instalment.";

export const NPV_SOLAR_SUMMARY_LABEL = "Today's value rate (NPV)";
