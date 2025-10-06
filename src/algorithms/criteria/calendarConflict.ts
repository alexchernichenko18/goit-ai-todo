import { clamp01 } from '../../utils';
import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';

export default function calendarConflict(todo: ITodo, ctx: ScoringContext): number {
  if (!todo.deadline) return 0;
  const deadline = new Date(todo.deadline).getTime();
  const hoursLeft = (deadline - ctx.now) / 36e5;
  if (hoursLeft < 0) return 1;
  const durationPenalty = todo.estimateMinutes ? clamp01(todo.estimateMinutes / 240) : 0.1;
  const proximityPenalty = clamp01(1 - hoursLeft / 24);
  const combined = 0.6 * proximityPenalty + 0.4 * durationPenalty;
  return clamp01(Math.pow(combined, 1.3));
}