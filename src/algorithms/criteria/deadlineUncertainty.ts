import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';
import { clamp01 } from '../../utils';

const w = {
  hasDeadline: 0.5,
  distance: 0.3,
  precision: 0.2
};

export default function deadlineUncertainty(todo: ITodo, _ctx: ScoringContext): number {
  if (!todo.deadline) return 0.5;

  const due = new Date(todo.deadline).getTime();
  const now = Date.now();
  const diff = due - now;

  const days = diff / (1000 * 60 * 60 * 24);
  const hasDeadline = 1;
  const distance = clamp01(1 - Math.abs(days) / 30);

  const precision = todo.deadline.endsWith('00:00') ? 0.4 : 1;

  const score =
    w.hasDeadline * hasDeadline +
    w.distance * distance +
    w.precision * precision;

  return clamp01(score);
}