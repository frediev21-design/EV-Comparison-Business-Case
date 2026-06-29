/** Parses form numbers including SA locale commas (e.g. "7,5" → 7.5). */
export function parseLocaleNumber(value: string): number {
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}
