import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';
import { clamp01 } from '../../utils';

export default function focusRequirement(todo: ITodo, ctx: ScoringContext): number {
  const tag = todo.tag ?? 'general';
  const importance = todo.importance ?? 0.5;
  const estimate = todo.estimateMinutes ?? 30;
  const now = new Date(ctx.now);
  const hour = now.getHours();

  let base = 0.5;

  if (tag === 'work' || tag === 'study') base += 0.2;
  if (importance > 0.8) base += 0.2;
  if (estimate > 90) base += 0.1;
  if (hour >= 22 || hour <= 6) base -= 0.3;

  const randomness = Math.sin(ctx.now / 60000) * 0.05;
  return clamp01(base + randomness);
}