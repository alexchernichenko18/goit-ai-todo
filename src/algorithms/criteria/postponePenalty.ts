import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';
import { clamp01 } from '../../utils';

export default function postponePenalty(todo: ITodo, ctx: ScoringContext): number {
  const count = todo.postponedCount ?? 0;
  if (count === 0) return 0;

  const last = todo.lastPostponedAt ? new Date(todo.lastPostponedAt).getTime() : null;
  const daysSinceLast = last ? (ctx.now - last) / (1000 * 60 * 60 * 24) : Infinity;

  const recentPenalty = daysSinceLast < 3 ? 0.5 : daysSinceLast < 7 ? 0.3 : 0.1;
  const base = count / 10;

  const raw = base + recentPenalty;
  return clamp01(raw);
}