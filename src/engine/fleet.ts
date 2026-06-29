import type { Assumptions, WhatIfOverrides, TradeInResult, FinanceResult, ComparisonKpis, RunningCostBreakdown, OwnershipResult, OwnershipHorizon, SolarResult } from "./types";

export function getFleetCount(assumptions: Assumptions, whatIf?: WhatIfOverrides): number {
  const count = whatIf?.fleetVehicleCount ?? assumptions.fleetVehicleCount ?? 1;
  return Math.max(1, Math.min(100, Math.round(count)));
}

function scaleBreakdown(b: RunningCostBreakdown, count: number): RunningCostBreakdown {
  const scale = (n: number) => n * count;
  return {
    fuel: scale(b.fuel),
    electricity: scale(b.electricity),
    solar: scale(b.solar),
    grid: scale(b.grid),
    maintenance: scale(b.maintenance),
    insurance: scale(b.insurance),
    tyres: scale(b.tyres),
    licence: scale(b.licence),
    repairs: scale(b.repairs),
    servicePlans: scale(b.servicePlans),
    total: scale(b.total),
  };
}

export function scaleTradeInForFleet(tradeIn: TradeInResult, count: number): TradeInResult {
  if (count <= 1) return tradeIn;
  const s = (n: number) => n * count;
  return {
    ...tradeIn,
    currentVehicleValue: s(tradeIn.currentVehicleValue),
    outstandingFinance: s(tradeIn.outstandingFinance),
    tradeEquity: s(tradeIn.tradeEquity),
    additionalCash: s(tradeIn.additionalCash),
    totalDeposit: s(tradeIn.totalDeposit),
    vehiclePrice: s(tradeIn.vehiclePrice),
    amountFinanced: s(tradeIn.amountFinanced),
  };
}

export function scaleFinanceForFleet(finance: FinanceResult[], count: number): FinanceResult[] {
  if (count <= 1) return finance;
  return finance.map((f) => ({
    ...f,
    amountFinanced: f.amountFinanced * count,
    monthlyInstalment: f.monthlyInstalment * count,
    totalInterest: f.totalInterest * count,
    totalPayments: f.totalPayments * count,
    schedule: f.schedule.map((row) => ({
      ...row,
      payment: row.payment * count,
      interest: row.interest * count,
      capital: row.capital * count,
      balance: row.balance * count,
    })),
  }));
}

export function scaleKpisForFleet(kpis: ComparisonKpis, count: number): ComparisonKpis {
  if (count <= 1) return kpis;
  const s = (n: number) => n * count;
  return {
    ...kpis,
    currentMonthlyCost: s(kpis.currentMonthlyCost),
    replacementMonthlyCost: s(kpis.replacementMonthlyCost),
    currentFinanceInstalment: s(kpis.currentFinanceInstalment),
    currentRunningMonthly: s(kpis.currentRunningMonthly),
    replacementFinanceInstalment: s(kpis.replacementFinanceInstalment),
    replacementRunningMonthly: s(kpis.replacementRunningMonthly),
    operatingMonthlySaving: s(kpis.operatingMonthlySaving),
    financeMonthlyDelta: s(kpis.financeMonthlyDelta),
    monthlySaving: s(kpis.monthlySaving),
    annualSaving: s(kpis.annualSaving),
    tenYearSaving: s(kpis.tenYearSaving),
    npv10Year: s(kpis.npv10Year),
    financeBalance: s(kpis.financeBalance),
    solarSaving: s(kpis.solarSaving),
    fuelSaving: s(kpis.fuelSaving),
    // cost per km unchanged (per vehicle)
  };
}

export function scaleCurrentRunningForFleet(
  current: RunningCostBreakdown,
  count: number
): RunningCostBreakdown {
  return count <= 1 ? current : scaleBreakdown(current, count);
}

export function scaleReplacementRunningForFleet(
  replacements: Record<string, RunningCostBreakdown>,
  count: number
): Record<string, RunningCostBreakdown> {
  if (count <= 1) return replacements;
  return Object.fromEntries(
    Object.entries(replacements).map(([id, b]) => [id, scaleBreakdown(b, count)])
  );
}

export function scaleSolarForFleet(solar: SolarResult, count: number): SolarResult {
  if (count <= 1) return solar;
  const s = (n: number) => n * count;
  return {
    ...solar,
    gridKwhPurchased: s(solar.gridKwhPurchased),
    solarContributionKwh: s(solar.solarContributionKwh),
    annualChargingCost: s(solar.annualChargingCost),
    tenYearChargingCost: s(solar.tenYearChargingCost),
    fuelSavingsVsBaseline: s(solar.fuelSavingsVsBaseline),
    visual: {
      ...solar.visual,
      vehicle: s(solar.visual.vehicle),
      moneySaved: s(solar.visual.moneySaved),
    },
  };
}

export function scaleOwnershipForFleet(
  ownership: OwnershipResult,
  count: number
): OwnershipResult {
  if (count <= 1) return ownership;
  const scaleHorizon = (h: OwnershipHorizon): OwnershipHorizon => ({
    ...h,
    monthlyCost: h.monthlyCost * count,
    annualCost: h.annualCost * count,
    totalCost: h.totalCost * count,
    costPerDay: h.costPerDay * count,
    netOwnershipCost: h.netOwnershipCost * count,
    ownershipAfterResale: h.ownershipAfterResale * count,
  });
  return {
    current: ownership.current.map(scaleHorizon),
    replacements: Object.fromEntries(
      Object.entries(ownership.replacements).map(([id, horizons]) => [
        id,
        horizons.map(scaleHorizon),
      ])
    ),
  };
}
