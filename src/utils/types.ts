export type EnergyLevel = 'low' | 'medium' | 'high';
export type LocationType = 'any' | 'home' | 'office' | 'outdoor';
export type Tag = 'general' | 'work' | 'home' | 'study';

export interface ITodo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  order: number;
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
}