export type EnergyLevel = 'low' | 'medium' | 'high';
export type LocationType = 'any' | 'home' | 'office' | 'outdoor';
export type Tag = 'general' | 'work' | 'home' | 'study';

export interface ITodo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;

  deadline?: string | null;
  importance: number;
  estimateMinutes?: number;
  energy?: EnergyLevel;
  tag?: Tag;
  context?: string;
  location?: LocationType;
  dependencyIds?: string[];

  createdAt: string;
  updatedAt: string;
  postponedCount: number;
  lastPostponedAt?: string | null;

  urgencyScore?: number;
  overdueSeverity?: number;
  importanceScore?: number;
  effortInversion?: number;
  postponePenalty?: number;
  recency?: number;
  streakConsistency?: number;
  dependencyReadiness?: number;
  contextFit?: number;
  timeOfDayFit?: number;
  energyFit?: number;
  calendarConflict?: number;
  rewardScore?: number;
  riskScore?: number;
  collaborationNeed?: number;
  habitStrength?: number;
  deadlineUncertainty?: number;
  locationFit?: number;
  focusRequirement?: number;
  sessionLengthFit?: number;

  priorityScore?: number;
}
