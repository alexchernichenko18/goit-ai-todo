import { ITodo } from '../utils/types';
import { CriterionKey } from './types';

type Scorer = (t: ITodo, now: Date) => number;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const urgencyScore: Scorer = (t, now) => {
  if (!t.deadline) return 0;
  const deadline = new Date(t.deadline).getTime();
  const diffMs = deadline - now.getTime();
  const diffH = diffMs / 36e5;
  if (diffH <= 0) return 1;
  if (diffH >= 168) return 0;
  return clamp01(1 - diffH / 168);
};

const importanceScore: Scorer = (t) => clamp01(t.importance ?? 0);

const zero: Scorer = () => 0;

export const SCORERS: Record<CriterionKey, Scorer> = {
  urgencyScore,
  overdueSeverity: zero,
  importanceScore,
  effortInversion: zero,
  postponePenalty: zero,
  recency: zero,
  streakConsistency: zero,
  dependencyReadiness: zero,
  contextFit: zero,
  timeOfDayFit: zero,
  energyFit: zero,
  calendarConflict: zero,
  rewardScore: zero,
  riskScore: zero,
  collaborationNeed: zero,
  habitStrength: zero,
  deadlineUncertainty: zero,
  locationFit: zero,
  focusRequirement: zero,
  sessionLengthFit: zero
};