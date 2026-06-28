import type { ScoreRatingLabel } from "./types";

export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function scoreFromRatio(value: number, baseline: number, invert = false): number {
  if (baseline === 0) return invert ? 100 : 50;
  const ratio = value / baseline;
  const raw = invert ? (1 - ratio) * 100 + 50 : ratio * 100;
  return clampScore(raw);
}

export function getScoreRating(total: number): {
  stars: number;
  rating: ScoreRatingLabel;
  subtitle: string;
} {
  if (total >= 95) {
    return { stars: 5, rating: "Outstanding Investment", subtitle: "Recommended Immediately" };
  }
  if (total >= 85) {
    return { stars: 5, rating: "Strongly Recommended", subtitle: "Proceed with confidence" };
  }
  if (total >= 75) {
    return { stars: 4, rating: "Good Investment", subtitle: "Favourable business case" };
  }
  if (total >= 65) {
    return { stars: 3, rating: "Acceptable", subtitle: "Proceed with monitoring" };
  }
  return { stars: 2, rating: "Financially Weak", subtitle: "Recommend further review" };
}

export function renderStars(count: number): string {
  return "★".repeat(count) + "☆".repeat(5 - count);
}
