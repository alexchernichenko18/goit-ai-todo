import { ITodo, Tag, EnergyLevel, LocationType } from '../utils/types';

export type CreateTodoParams = Partial<{
  title: string;
  description: string;
  deadline: string | null;
  importance: number;
  estimateMinutes: number;
  tag: Tag;
  energy: EnergyLevel;
  location: LocationType;
  context: string;
  dependencyIds: string[];
}>;

export const createTodo = (params: CreateTodoParams = {}): ITodo => {
  const now = new Date().toISOString();
  const {
    title = '',
    description = '',
    deadline = null,
    importance = 0.5,
    estimateMinutes = 30,
    tag = 'general',
    energy = 'medium',
    location = 'any',
    context = '',
    dependencyIds = []
  } = params;

  return {
    id: crypto.randomUUID(),
    title,
    description,
    completed: false,
    order: Date.now(),
    deadline,
    importance,
    estimateMinutes,
    energy,
    tag,
    context,
    location,
    dependencyIds,
    createdAt: now,
    updatedAt: now,
    postponedCount: 0,
    lastPostponedAt: null,
    priorityScore: 0
  };
};