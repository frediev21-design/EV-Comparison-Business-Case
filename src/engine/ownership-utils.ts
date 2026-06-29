export function kmMultiplierForYear(year: number, annualKmGrowth: number): number {
  if (annualKmGrowth <= 0 || year <= 1) return 1;
  return Math.pow(1 + annualKmGrowth / 100, year - 1);
}
