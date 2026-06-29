import type { BusinessCaseResult, BusinessCaseInput } from "@/engine/types";
import { formatCurrency } from "./format";
import { MODEL_DISCLAIMER } from "./model-disclaimer";

export function generatePrintHtml(
  input: BusinessCaseInput,
  result: BusinessCaseResult,
  reportType: string
): string {
  const selectedName =
    input.replacements.find((v) => v.id === input.selectedReplacementId)?.name ?? "Replacement";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${reportType} - Fleet EV TCO</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; padding: 40px; color: #1a1a2e; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    h2 { font-size: 16px; color: #64748b; margin-top: 32px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    .meta { color: #64748b; font-size: 12px; margin-bottom: 32px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 16px 0; }
    .kpi { background: #f8fafc; border-radius: 8px; padding: 16px; }
    .kpi-label { font-size: 11px; text-transform: uppercase; color: #64748b; }
    .kpi-value { font-size: 22px; font-weight: 700; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
    th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f1f5f9; font-weight: 600; }
    .recommendation { background: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0; font-size: 14px; line-height: 1.6; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>${reportType}</h1>
  <p class="meta">Generated ${new Date().toLocaleString()} · ${input.current.manufacturer} ${input.current.model} → ${selectedName}</p>

  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-label">Investment Score</div><div class="kpi-value">${result.decision.investmentScore.total}/100</div></div>
    <div class="kpi"><div class="kpi-label">${result.decision.trafficLight.label}</div><div class="kpi-value">${result.decision.investmentScore.rating}</div></div>
    <div class="kpi"><div class="kpi-label">Indicative Monthly Cash Flow</div><div class="kpi-value">${formatCurrency(result.kpis.monthlySaving)}</div></div>
    <div class="kpi"><div class="kpi-label">Annual Cash Flow Delta</div><div class="kpi-value">${formatCurrency(result.kpis.annualSaving)}</div></div>
    <div class="kpi"><div class="kpi-label">10-Year Net TCO Delta</div><div class="kpi-value">${formatCurrency(result.kpis.tenYearSaving)}</div></div>
    <div class="kpi"><div class="kpi-label">Amount Financed</div><div class="kpi-value">${formatCurrency(result.tradeIn.amountFinanced)}</div></div>
  </div>

  ${reportType === "Executive Report" ? `
  <h2>Score Breakdown</h2>
  <table>
    <tr><th>Criterion</th><th>Score</th><th>Weight</th></tr>
    ${result.decision.investmentScore.criteria.map(c =>
      `<tr><td>${c.label}</td><td>${Math.round(c.score)}</td><td>${(c.weight * 100).toFixed(0)}%</td></tr>`
    ).join("")}
  </table>
  <h2>SWOT Analysis</h2>
  <h3>Strengths</h3><ul>${result.decision.swot.strengths.map(s => `<li>${s}</li>`).join("")}</ul>
  <h3>Weaknesses</h3><ul>${result.decision.swot.weaknesses.map(s => `<li>${s}</li>`).join("")}</ul>
  <h3>Opportunities</h3><ul>${result.decision.swot.opportunities.map(s => `<li>${s}</li>`).join("")}</ul>
  <h3>Threats</h3><ul>${result.decision.swot.threats.map(s => `<li>${s}</li>`).join("")}</ul>
  <h2>Decision Advisor</h2>
  <ul>${result.decision.advisorTips.map(t => `<li>${t.message}</li>`).join("")}</ul>
  ` : ""}

  ${reportType === "Board Pack" ? generateBoardPackSections(input, result) : ""}

  <h2>Trade-In Summary</h2>
  <table>
    <tr><td>Current Vehicle Value</td><td>${formatCurrency(result.tradeIn.currentVehicleValue)}</td></tr>
    <tr><td>Outstanding Finance</td><td>${formatCurrency(result.tradeIn.outstandingFinance)}</td></tr>
    <tr><td>Trade Equity</td><td>${formatCurrency(result.tradeIn.tradeEquity)}</td></tr>
    <tr><td>Total Deposit</td><td>${formatCurrency(result.tradeIn.totalDeposit)}</td></tr>
    <tr><td>Amount Financed</td><td>${formatCurrency(result.tradeIn.amountFinanced)}</td></tr>
  </table>

  <h2>Executive Recommendation</h2>
  <div class="recommendation">${result.decision.executiveRecommendation}</div>

  ${reportType === "Bank Finance Report" ? `
  <h2>Finance Schedule (First 12 Months)</h2>
  <table>
    <tr><th>Month</th><th>Payment</th><th>Interest</th><th>Capital</th><th>Balance</th></tr>
    ${result.finance.find(f => f.vehicleId === input.selectedReplacementId)?.schedule.slice(0, 12).map(row =>
      `<tr><td>${row.month}</td><td>${formatCurrency(row.payment)}</td><td>${formatCurrency(row.interest)}</td><td>${formatCurrency(row.capital)}</td><td>${formatCurrency(row.balance)}</td></tr>`
    ).join("") ?? ""}
  </table>` : ""}

  <p class="meta" style="margin-top: 48px; border-top: 1px solid #e2e8f0; padding-top: 16px;">${MODEL_DISCLAIMER}</p>
</body>
</html>`;
}

export function printReport(input: BusinessCaseInput, result: BusinessCaseResult, reportType: string) {
  const html = generatePrintHtml(input, result, reportType);
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  }
}

export function downloadPdfViaPrint(input: BusinessCaseInput, result: BusinessCaseResult, reportType: string) {
  printReport(input, result, reportType);
}

/** Combined executive board pack for CFO / board presentations. */
export function downloadBoardPack(input: BusinessCaseInput, result: BusinessCaseResult) {
  printReport(input, result, "Board Pack");
}

export function generateBoardPackSections(input: BusinessCaseInput, result: BusinessCaseResult): string {
  const selectedName =
    input.replacements.find((v) => v.id === input.selectedReplacementId)?.name ?? "Replacement";
  const d = result.decision;

  return `
  <h2>Investment Decision</h2>
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-label">Score</div><div class="kpi-value">${d.investmentScore.total}/100</div></div>
    <div class="kpi"><div class="kpi-label">Status</div><div class="kpi-value">${d.trafficLight.label}</div></div>
    <div class="kpi"><div class="kpi-label">Operating Saving/mo</div><div class="kpi-value">${formatCurrency(result.kpis.operatingMonthlySaving)}</div></div>
    <div class="kpi"><div class="kpi-label">Finance Δ/mo</div><div class="kpi-value">${formatCurrency(result.kpis.financeMonthlyDelta)}</div></div>
    <div class="kpi"><div class="kpi-label">Net Saving/mo</div><div class="kpi-value">${formatCurrency(result.kpis.monthlySaving)}</div></div>
    <div class="kpi"><div class="kpi-label">Payback</div><div class="kpi-value">${result.kpis.paybackMonths > 0 ? result.kpis.paybackMonths + " mo" : "N/A"}</div></div>
  </div>

  <h2>Board Summary</h2>
  <table>
    <tr><td>Current Situation</td><td>${d.boardSummary.currentSituation}</td></tr>
    <tr><td>Proposed Investment</td><td>${d.boardSummary.proposedInvestment}</td></tr>
    <tr><td>Amount Financed</td><td>${formatCurrency(d.boardSummary.amountFinanced)}</td></tr>
    <tr><td>Monthly Cash Flow Impact</td><td>${formatCurrency(d.boardSummary.monthlyCashFlow)}</td></tr>
    <tr><td>10-Year Net TCO Delta</td><td>${formatCurrency(d.boardSummary.tenYearSavings)}</td></tr>
    <tr><td>Recommendation</td><td>${d.boardSummary.overallRecommendation}</td></tr>
  </table>

  <h2>Monthly Cost Comparison</h2>
  <table>
    <tr><th></th><th>Current (${input.current.manufacturer} ${input.current.model})</th><th>Replacement (${selectedName})</th></tr>
    <tr><td>Finance</td><td>${formatCurrency(result.kpis.currentFinanceInstalment)}</td><td>${formatCurrency(result.kpis.replacementFinanceInstalment)}</td></tr>
    <tr><td>Running costs</td><td>${formatCurrency(result.kpis.currentRunningMonthly)}</td><td>${formatCurrency(result.kpis.replacementRunningMonthly)}</td></tr>
    <tr><td><strong>Total / month</strong></td><td><strong>${formatCurrency(result.kpis.currentMonthlyCost)}</strong></td><td><strong>${formatCurrency(result.kpis.replacementMonthlyCost)}</strong></td></tr>
  </table>
  `;
}
