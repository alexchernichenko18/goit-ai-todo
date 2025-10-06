import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';
import { clamp01 } from '../../utils';

export default function recency(todo: ITodo, ctx: ScoringContext): number {
  const updated = new Date(todo.updatedAt).getTime();
  const diff = ctx.now - updated;
  const days = diff / (1000 * 60 * 60 * 24);

  if (days < 1) return 1;
  if (days < 3) return 0.8;
  if (days < 7) return 0.5;
  if (days < 14) return 0.2;

  const raw = 1 - Math.min(days / 30, 1);
  return clamp01(raw);
}