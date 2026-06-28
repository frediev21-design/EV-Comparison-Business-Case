export type ScoreRatingLabel =
  | "Outstanding Investment"
  | "Strongly Recommended"
  | "Good Investment"
  | "Acceptable"
  | "Financially Weak";

export type TrafficLightStatus = "go" | "review" | "stop";

export type RiskMatrixLevel = "green" | "amber" | "red";

export interface ScoreCriterion {
  id: string;
  label: string;
  weight: number;
  score: number;
  weightedScore: number;
}

export interface InvestmentScore {
  total: number;
  stars: number;
  rating: ScoreRatingLabel;
  subtitle: string;
  criteria: ScoreCriterion[];
}

export interface TrafficLight {
  status: TrafficLightStatus;
  label: string;
  description: string;
}

export interface BoardSummary {
  currentSituation: string;
  proposedInvestment: string;
  capitalRequired: number;
  amountFinanced: number;
  monthlyCashFlow: number;
  fuelSavings: number;
  maintenanceSavings: number;
  solarSavings: number;
  tenYearOwnershipCost: number;
  tenYearSavings: number;
  overallRecommendation: string;
}

export interface RiskMatrixItem {
  id: string;
  label: string;
  level: RiskMatrixLevel;
  description: string;
  category: "current" | "replacement";
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface TimelineEvent {
  id: string;
  label: string;
  date: string;
  description?: string;
}

export interface AdvisorTip {
  id: string;
  message: string;
  priority: "high" | "medium" | "low";
}

export interface DecisionIntelligence {
  investmentScore: InvestmentScore;
  trafficLight: TrafficLight;
  boardSummary: BoardSummary;
  riskMatrix: RiskMatrixItem[];
  swot: SwotAnalysis;
  timeline: TimelineEvent[];
  advisorTips: AdvisorTip[];
  executiveRecommendation: string;
}
