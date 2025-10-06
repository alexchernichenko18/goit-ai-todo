import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

const dynamicHorizonHours = (importance: number, estimateMinutes?: number) => {
  const base = 168;
  const impFactor = 0.5 + 0.5 * importance;
  const effort = Math.max(15, estimateMinutes ?? 30);
  const effortFactor = Math.min(2, Math.sqrt(effort / 30));
  const horizon = base / (impFactor * effortFactor);
  return Math.max(24, Math.min(336, horizon));
};

export default function urgency(todo: ITodo, ctx: ScoringContext): number {
  if (!todo.deadline) return 0;
  const now = ctx.now;
  const due = new Date(todo.deadline).getTime();
  const diffH = (due - now) / 36e5;

  const overduePenalty = diffH < 0 ? clamp01(Math.min(1, Math.abs(diffH) / 72)) : 0;

  const horizon = dynamicHorizonHours(todo.importance ?? 0.5, todo.estimateMinutes);
  const x = -diffH / (horizon / 6);
  const curve = sigmoid(x);

  const dueDate = new Date(due);
  const sameDay =
    new Date(now).getFullYear() === dueDate.getFullYear() &&
    new Date(now).getMonth() === dueDate.getMonth() &&
    new Date(now).getDate() === dueDate.getDate();
  const sameDayBoost = sameDay ? 0.08 : 0;

  const raw = curve + overduePenalty + sameDayBoost;
  return clamp01(raw);
}