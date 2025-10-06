import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';
import { clamp01 } from '../../utils';

export default function habitStrength(todo: ITodo, ctx: ScoringContext): number {
  const createdAt = new Date(todo.createdAt).getTime();
  const updatedAt = new Date(todo.updatedAt).getTime();
  const daysAlive = Math.max(1, (ctx.now - createdAt) / (1000 * 60 * 60 * 24));

  const updates = Math.max(1, (updatedAt - createdAt) / (1000 * 60 * 60 * 24));
  const streakFactor = clamp01(Math.log1p(updates) / Math.log1p(daysAlive));

  const completionMultiplier = todo.completed ? 1.2 : 1;
  const postponePenalty = Math.max(0, 1 - (todo.postponedCount ?? 0) * 0.1);

  const base = 0.4 + 0.4 * streakFactor * completionMultiplier * postponePenalty;
  const noise = Math.sin(ctx.now / 1000000) * 0.05;

  return clamp01(base + noise);
}