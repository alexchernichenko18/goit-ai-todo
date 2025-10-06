import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';
import { clamp01 } from '../../utils';

export default function overdueSeverity(todo: ITodo, ctx: ScoringContext): number {
  if (!todo.deadline) return 0;

  const due = new Date(todo.deadline).getTime();
  const diff = ctx.now - due;
  if (diff <= 0) return 0;

  const daysOverdue = diff / (1000 * 60 * 60 * 24);
  const raw = daysOverdue / 7;

  const urgencyPenalty = todo.importance * 0.3;
  const postponePenalty = (todo.postponedCount ?? 0) * 0.05;
  const recencyPenalty = todo.updatedAt ? (ctx.now - new Date(todo.updatedAt).getTime()) / (1000 * 60 * 60 * 24 * 30) : 0;

  const penalty = urgencyPenalty + postponePenalty + recencyPenalty;
  const adjusted = raw * (1 + penalty);

  return clamp01(adjusted);
}