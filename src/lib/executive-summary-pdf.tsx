"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { BusinessCaseInput, BusinessCaseResult } from "@/engine/types";
import type { TrafficLightStatus } from "@/engine/decision/types";
import { formatCurrency } from "./format";
import { downloadBlob } from "./export-excel";

const TRAFFIC_LIGHT_COLOR: Record<TrafficLightStatus, string> = {
  go: "#10b981",
  review: "#f59e0b",
  stop: "#ef4444",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a2e",
  },
  brand: {
    fontSize: 9,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  meta: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  scoreBadge: {
    marginLeft: "auto",
    backgroundColor: "#f1f5f9",
    borderRadius: 6,
    padding: "8 12",
    alignItems: "center",
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreSub: {
    fontSize: 8,
    color: "#64748b",
  },
  kpiRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  kpi: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    padding: 12,
  },
  kpiLabel: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tableLabel: {
    color: "#64748b",
  },
  tableValue: {
    fontWeight: "bold",
  },
  recommendation: {
    backgroundColor: "#ecfdf5",
    borderLeftWidth: 3,
    borderLeftColor: "#10b981",
    padding: 12,
    marginTop: 8,
    marginBottom: 20,
    fontSize: 9,
    lineHeight: 1.5,
  },
  disclaimer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 7,
    color: "#94a3b8",
    lineHeight: 1.4,
  },
});

interface ExecutiveSummaryDocProps {
  input: BusinessCaseInput;
  result: BusinessCaseResult;
  caseName: string;
}

function ExecutiveSummaryDocument({ input, result, caseName }: ExecutiveSummaryDocProps) {
  const selectedName =
    input.replacements.find((v) => v.id === input.selectedReplacementId)?.name ?? "Replacement";
  const currentName = `${input.current.manufacturer} ${input.current.model}`.trim();
  const d = result.decision;
  const tlColor = TRAFFIC_LIGHT_COLOR[d.trafficLight.status];

  return (
    <Document title={`Executive Summary — ${caseName}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>Fleet EV TCO</Text>
        <Text style={styles.title}>Executive Summary</Text>
        <Text style={styles.meta}>
          {caseName} · {currentName || "Current vehicle"} → {selectedName} ·{" "}
          {new Date().toLocaleDateString("en-ZA")}
        </Text>

        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: tlColor }]} />
          <View>
            <Text style={styles.statusLabel}>{d.trafficLight.label}</Text>
            <Text style={{ fontSize: 9, color: "#64748b" }}>{d.investmentScore.rating}</Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreValue}>{d.investmentScore.total}/100</Text>
            <Text style={styles.scoreSub}>Investment score</Text>
          </View>
        </View>

        <View style={styles.kpiRow}>
          <View style={styles.kpi}>
            <Text style={styles.kpiLabel}>Monthly saving</Text>
            <Text style={styles.kpiValue}>{formatCurrency(result.kpis.monthlySaving)}</Text>
          </View>
          <View style={styles.kpi}>
            <Text style={styles.kpiLabel}>Amount financed</Text>
            <Text style={styles.kpiValue}>{formatCurrency(result.tradeIn.amountFinanced)}</Text>
          </View>
          <View style={styles.kpi}>
            <Text style={styles.kpiLabel}>10-year saving</Text>
            <Text style={styles.kpiValue}>{formatCurrency(result.kpis.tenYearSaving)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Trade-in summary</Text>
        <View>
          {[
            ["Current vehicle value", formatCurrency(result.tradeIn.currentVehicleValue)],
            ["Outstanding finance", formatCurrency(result.tradeIn.outstandingFinance)],
            ["Trade equity", formatCurrency(result.tradeIn.tradeEquity)],
            ["Total deposit", formatCurrency(result.tradeIn.totalDeposit)],
          ].map(([label, value]) => (
            <View key={label} style={styles.tableRow}>
              <Text style={styles.tableLabel}>{label}</Text>
              <Text style={styles.tableValue}>{value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recommendation</Text>
        <Text style={styles.recommendation}>{d.executiveRecommendation}</Text>

        <Text style={styles.disclaimer}>
          Estimates only — not financial advice. Based on user inputs and platform assumptions.
          Verify figures with your finance provider before making investment decisions.
        </Text>
      </Page>
    </Document>
  );
}

export async function downloadExecutiveSummary(
  input: BusinessCaseInput,
  result: BusinessCaseResult,
  caseName: string
) {
  const blob = await pdf(
    <ExecutiveSummaryDocument input={input} result={result} caseName={caseName} />
  ).toBlob();
  const slug = caseName.replace(/\s+/g, "-").toLowerCase() || "executive-summary";
  downloadBlob(blob, `${slug}-executive-summary.pdf`);
}
