const currencyFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const currencyPreciseFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number, precise = false): string {
  const formatter = precise ? currencyPreciseFormatter : currencyFormatter;
  return formatter.format(value);
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("en-ZA", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${formatNumber(value, decimals)}%`;
}

export function formatKm(value: number): string {
  return `${formatNumber(value, 0)} km`;
}

export function formatKmPerDay(value: number): string {
  return `${formatNumber(value, 0)} km/day`;
}

export function formatMonths(value: number): string {
  return `${value} months`;
}

export function formatDelta(value: number, asCurrency = true): string {
  const prefix = value >= 0 ? "+" : "";
  return prefix + (asCurrency ? formatCurrency(value) : formatNumber(value));
}
