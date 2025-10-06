import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';
import { clamp01 } from '../../utils';

export default function riskScore(todo: ITodo, _ctx: ScoringContext): number {
  const deadlineRisk = todo.deadline
    ? new Date(todo.deadline).getTime() < Date.now()
      ? 1
      : 1 - Math.min((new Date(todo.deadline).getTime() - Date.now()) / (3 * 24 * 60 * 60 * 1000), 1)
    : 0.2;

  const effortRisk = todo.estimateMinutes ? clamp01(todo.estimateMinutes / 240) : 0.1;
  const importanceRisk = 1 - clamp01(todo.importance);
  const total = (deadlineRisk * 0.5 + effortRisk * 0.3 + importanceRisk * 0.2);

  return clamp01(total);
}