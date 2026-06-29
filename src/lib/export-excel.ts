import ExcelJS from "exceljs";
import type { BusinessCaseResult, BusinessCaseInput } from "@/engine/types";
import { defaultExportBranding, formatDeveloperCredit, type ExportBranding } from "./brand";

export async function exportToExcel(
  input: BusinessCaseInput,
  result: BusinessCaseResult,
  reportType: string,
  branding: ExportBranding = defaultExportBranding()
): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = branding.dealerName ? `${branding.dealerName} · ${branding.appName}` : branding.appName;

  const summary = workbook.addWorksheet("Summary");
  if (branding.dealerName) summary.addRow([branding.dealerName, branding.dealerTagline ?? ""]);
  summary.addRow([`${branding.appName} upgrade analysis`, reportType]);
  summary.addRow(["Generated", new Date().toLocaleString()]);
  summary.addRow([]);
  summary.addRow(["KPI", "Value"]);
  summary.addRow(["Investment Score", result.decision.investmentScore.total]);
  summary.addRow(["Rating", result.decision.investmentScore.rating]);
  summary.addRow(["Decision", result.decision.trafficLight.label]);
  summary.addRow(["Current Monthly Cost", result.kpis.currentMonthlyCost]);
  summary.addRow(["Replacement Monthly Cost", result.kpis.replacementMonthlyCost]);
  summary.addRow(["Indicative Monthly Cash Flow", result.kpis.monthlySaving]);
  summary.addRow(["Annual Cash Flow Delta", result.kpis.annualSaving]);
  summary.addRow(["10-Year Net TCO Delta", result.kpis.tenYearSaving]);
  summary.addRow(["10-Year NPV", result.kpis.npv10Year]);
  summary.addRow(["Discount Rate %", input.assumptions.discountRate ?? 10.5]);
  summary.addRow(["Payback Months", result.kpis.paybackMonths]);
  summary.addRow([]);
  summary.addRow([formatDeveloperCredit(branding)]);

  const inputs = workbook.addWorksheet("Inputs");
  inputs.addRow(["Current Vehicle"]);
  inputs.addRow(["Manufacturer", input.current.manufacturer]);
  inputs.addRow(["Model", input.current.model]);
  inputs.addRow(["Current Value", input.current.currentValue]);
  inputs.addRow(["Outstanding Finance", input.current.outstandingFinance]);
  inputs.addRow([]);
  inputs.addRow(["Trade-In"]);
  inputs.addRow(["Trade Equity", result.tradeIn.tradeEquity]);
  inputs.addRow(["Total Deposit", result.tradeIn.totalDeposit]);
  inputs.addRow(["Amount Financed", result.tradeIn.amountFinanced]);

  const finance = workbook.addWorksheet("Finance Schedule");
  finance.addRow(["Month", "Payment", "Interest", "Capital", "Balance"]);
  const selectedFinance = result.finance.find((f) => f.vehicleId === input.selectedReplacementId);
  selectedFinance?.schedule.forEach((row) => {
    finance.addRow([row.month, row.payment, row.interest, row.capital, row.balance]);
  });

  const running = workbook.addWorksheet("Running Costs");
  running.addRow(["Category", "Current", "Replacement"]);
  const selectedRunning = result.running.replacements[input.selectedReplacementId];
  running.addRow(["Fuel", result.running.current.fuel, selectedRunning?.fuel ?? 0]);
  running.addRow(["Electricity", result.running.current.electricity, selectedRunning?.electricity ?? 0]);
  running.addRow(["Maintenance", result.running.current.maintenance, selectedRunning?.maintenance ?? 0]);
  running.addRow(["Insurance", result.running.current.insurance, selectedRunning?.insurance ?? 0]);
  running.addRow(["Total", result.running.current.total, selectedRunning?.total ?? 0]);

  if (reportType === "Executive Report" || reportType === "Business Case") {
    const swot = workbook.addWorksheet("SWOT");
    swot.addRow(["Strengths", result.decision.swot.strengths.join("; ")]);
    swot.addRow(["Weaknesses", result.decision.swot.weaknesses.join("; ")]);
    swot.addRow(["Opportunities", result.decision.swot.opportunities.join("; ")]);
    swot.addRow(["Threats", result.decision.swot.threats.join("; ")]);

    const scoreSheet = workbook.addWorksheet("Investment Score");
    scoreSheet.addRow(["Criterion", "Score", "Weight"]);
    result.decision.investmentScore.criteria.forEach((c) => {
      scoreSheet.addRow([c.label, Math.round(c.score), c.weight]);
    });
  }

  if (reportType === "Comparison Report") {
    const comparison = workbook.addWorksheet("Comparison");
    comparison.addRow(["Vehicle", "Price", "Monthly Instalment", "Annual Running"]);
    result.finance.forEach((f) => {
      const runningCost = result.running.replacements[f.vehicleId];
      comparison.addRow([f.vehicleName, input.replacements.find((v) => v.id === f.vehicleId)?.price, f.monthlyInstalment, runningCost?.total]);
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
