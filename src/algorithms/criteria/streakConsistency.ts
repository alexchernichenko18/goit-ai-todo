import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';
import { clamp01 } from '../../utils';

export default function streakConsistency(todo: ITodo, ctx: ScoringContext): number {
  const now = ctx.now;
  const last = todo.updatedAt ? new Date(todo.updatedAt).getTime() : 0;
  const daysSince = (now - last) / (1000 * 60 * 60 * 24);

  const streak = todo.postponedCount ?? 0;
  const recencyBoost = 1 - clamp01(daysSince / 7);
  const streakPenalty = clamp01(streak / 10);
  const consistency = clamp01(recencyBoost * (1 - streakPenalty));

  return consistency;
}