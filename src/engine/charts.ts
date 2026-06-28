import type {
  BusinessCaseResult,
  ChartDataPoint,
  ChartSeries,
  FinanceResult,
  OwnershipResult,
  RunningCostResult,
} from "./types";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function buildChartSeries(
  financeResults: FinanceResult[],
  running: RunningCostResult,
  ownership: OwnershipResult,
  selectedId: string,
  selectedFinance: FinanceResult | undefined
): ChartSeries {
  const selectedRunning = running.replacements[selectedId];

  const monthlyCashFlow: ChartDataPoint[] = MONTH_LABELS.map((label, i) => ({
    label,
    current: running.current.total / 12 + (i === 0 ? 0 : 0),
    replacement: (selectedRunning?.total ?? 0) / 12 + (selectedFinance?.monthlyInstalment ?? 0),
    finance: selectedFinance?.monthlyInstalment ?? 0,
    maintenance: (selectedRunning?.maintenance ?? 0) / 12,
  }));

  const fuelVsElectricity: ChartDataPoint[] = [
    {
      label: "Annual Energy",
      fuel: running.current.fuel,
      electricity: selectedRunning?.electricity ?? 0,
    },
  ];

  const financeBalance: ChartDataPoint[] =
    selectedFinance?.schedule
      .filter((_, i) => i % 6 === 0 || i === selectedFinance.schedule.length - 1)
      .map((row) => ({
        label: `M${row.month}`,
        balance: row.balance,
        value: row.balance,
      })) ?? [];

  const ownershipCost: ChartDataPoint[] = [5, 7, 10].map((years) => {
    const current = ownership.current.find((h) => h.years === years);
    const replacement = ownership.replacements[selectedId]?.find((h) => h.years === years);
    return {
      label: `${years}yr`,
      current: current?.totalCost ?? 0,
      replacement: replacement?.totalCost ?? 0,
    };
  });

  const costPerKm: ChartDataPoint[] = [5, 7, 10].map((years) => {
    const current = ownership.current.find((h) => h.years === years);
    const replacement = ownership.replacements[selectedId]?.find((h) => h.years === years);
    return {
      label: `${years}yr`,
      current: current?.costPerKm ?? 0,
      replacement: replacement?.costPerKm ?? 0,
    };
  });

  let cumulative = 0;
  const cumulativeSavings: ChartDataPoint[] = Array.from({ length: 10 }, (_, i) => {
    const year = i + 1;
    const currentCost = ownership.current.find((h) => h.years === year)?.annualCost ??
      (ownership.current.find((h) => h.years === 10)?.annualCost ?? 0);
    const replacementCost =
      ownership.replacements[selectedId]?.find((h) => h.years === year)?.annualCost ??
      (ownership.replacements[selectedId]?.find((h) => h.years === 10)?.annualCost ?? 0);
    cumulative += currentCost - replacementCost;
    return { label: `Y${year}`, cumulative, value: cumulative };
  });

  const tenYearTco: ChartDataPoint[] = [
    {
      label: "10-Year TCO",
      current: ownership.current.find((h) => h.years === 10)?.totalCost ?? 0,
      replacement: ownership.replacements[selectedId]?.find((h) => h.years === 10)?.totalCost ?? 0,
    },
  ];

  const breakEven: ChartDataPoint[] = cumulativeSavings.map((point) => ({
    label: point.label,
    current: 0,
    replacement: point.cumulative ?? 0,
    cumulative: point.cumulative,
  }));

  const solarContribution: ChartDataPoint[] = [
    { label: "Solar", solar: selectedRunning?.solar ?? 0, value: selectedRunning?.solar ?? 0 },
    { label: "Grid", grid: selectedRunning?.grid ?? 0, value: selectedRunning?.grid ?? 0 },
  ];

  const maintenanceCosts: ChartDataPoint[] = [
    {
      label: "Maintenance",
      current: running.current.maintenance + running.current.repairs,
      replacement: (selectedRunning?.maintenance ?? 0) + (selectedRunning?.repairs ?? 0),
      maintenance: selectedRunning?.maintenance ?? 0,
    },
  ];

  return {
    monthlyCashFlow,
    fuelVsElectricity,
    financeBalance,
    ownershipCost,
    costPerKm,
    cumulativeSavings,
    tenYearTco,
    breakEven,
    solarContribution,
    maintenanceCosts,
  };
}

export type { BusinessCaseResult };
