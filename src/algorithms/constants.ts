import { WeightMap } from "./types";

export const WEIGHTS: WeightMap = {
  urgency: 0.14,
  overdueSeverity: 0.06,
  importanceScore: 0.14,
  effortInversion: 0.05,
  postponePenalty: 0.04,
  recency: 0.03,
  streakConsistency: 0.03,
  dependencyReadiness: 0.05,
  contextFit: 0.06,
  timeOfDayFit: 0.05,
  energyFit: 0.05,
  calendarConflict: 0.03,
  rewardScore: 0.05,
  riskScore: 0.05,
  collaborationNeed: 0.03,
  habitStrength: 0.03,
  deadlineUncertainty: 0.03,
  locationFit: 0.03,
  focusRequirement: 0.03,
  sessionLengthFit: 0.02
};