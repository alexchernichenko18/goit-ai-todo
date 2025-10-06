import { ITodo } from '../utils/types';

export type CriterionKey =
  | 'urgencyScore'
  | 'overdueSeverity'
  | 'importanceScore'
  | 'effortInversion'
  | 'postponePenalty'
  | 'recency'
  | 'streakConsistency'
  | 'dependencyReadiness'
  | 'contextFit'
  | 'timeOfDayFit'
  | 'energyFit'
  | 'calendarConflict'
  | 'rewardScore'
  | 'riskScore'
  | 'collaborationNeed'
  | 'habitStrength'
  | 'deadlineUncertainty'
  | 'locationFit'
  | 'focusRequirement'
  | 'sessionLengthFit';

export type Evaluator = (todo: ITodo, now: Date) => number;

export type Weights = Partial<Record<CriterionKey, number>>;

export type TimeSlot = 'morning' | 'day' | 'evening' | 'night';

export type ScoringContext = {
  now: number;
  slot: TimeSlot;
};

export type WeightMap = {
  urgency: number;
  overdueSeverity: number;
  importanceScore: number;
  effortInversion: number;
  postponePenalty: number;
  recency: number;
  streakConsistency: number;
  dependencyReadiness: number;
  contextFit: number;
  timeOfDayFit: number;
  energyFit: number;
  calendarConflict: number;
  rewardScore: number;
  riskScore: number;
  collaborationNeed: number;
  habitStrength: number;
  deadlineUncertainty: number;
  locationFit: number;
  focusRequirement: number;
  sessionLengthFit: number;
};