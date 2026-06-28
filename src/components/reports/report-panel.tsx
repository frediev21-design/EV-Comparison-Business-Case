"use client";

import { useCaseStore } from "@/store/case-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportToExcel, downloadBlob } from "@/lib/export-excel";
import { printReport, downloadPdfViaPrint } from "@/lib/export-pdf";
import { downloadExecutiveSummary } from "@/lib/executive-summary-pdf";
import { showToast } from "@/lib/toast";
import { FileDown, FileSpreadsheet, FileText, Printer } from "lucide-react";

const REPORT_TYPES = [
  "Executive Report",
  "Business Case",
  "Financial Summary",
  "Comparison Report",
  "Bank Finance Report",
  "Fleet Proposal",
  "Board Pack",
] as const;

export function ReportPanel() {
  const input = useCaseStore((s) => s.input);
  const result = useCaseStore((s) => s.result);
  const caseName = useCaseStore((s) => s.caseName);

  const handleExcel = async (reportType: string) => {
    const blob = await exportToExcel(input, result, reportType);
    downloadBlob(blob, `${caseName}-${reportType.replace(/\s/g, "-")}.xlsx`);
  };

  const handlePdf = (reportType: string) => {
    downloadPdfViaPrint(input, result, reportType);
  };

  const handlePrint = (reportType: string) => {
    printReport(input, result, reportType);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Reports</h2>
        <p className="text-sm text-muted-foreground">Generate professional reports for stakeholders.</p>
      </div>

      <Card className="border-accent/30 bg-accent/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Executive One-Pager</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <p className="flex-1 text-sm text-muted-foreground">
            Branded single-page PDF — traffic light, key KPIs, trade-in, and recommendation.
          </p>
          <Button
            size="sm"
            onClick={async () => {
              try {
                await downloadExecutiveSummary(input, result, caseName);
                showToast("Executive summary downloaded", "success");
              } catch {
                showToast("Could not generate PDF", "error");
              }
            }}
          >
            <FileDown className="mr-1 h-3 w-3" /> Download PDF
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORT_TYPES.map((reportType) => (
          <Card key={reportType}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{reportType}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => handlePdf(reportType)}>
                <FileText className="mr-1 h-3 w-3" /> PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExcel(reportType)}>
                <FileSpreadsheet className="mr-1 h-3 w-3" /> Excel
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handlePrint(reportType)}>
                <Printer className="mr-1 h-3 w-3" /> Print
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
