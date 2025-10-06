import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';
import { clamp01 } from '../../utils';

export default function importanceScore(todo: ITodo, ctx: ScoringContext): number {
  const imp = clamp01(todo.importance ?? 0.5);

  const overdueBoost =
    todo.deadline && new Date(todo.deadline).getTime() < ctx.now ? 0.2 : 0;

  const tagMultiplier =
    todo.tag === 'work' ? 1.1 :
      todo.tag === 'study' ? 1.05 :
        todo.tag === 'home' ? 0.95 : 1;

  const energyMultiplier =
    todo.energy === 'high' ? 1.1 :
      todo.energy === 'low' ? 0.9 : 1;

  const combined =
    imp * 0.7 +
    overdueBoost * 0.15 +
    (tagMultiplier - 1) * 0.1 +
    (energyMultiplier - 1) * 0.05;

  return clamp01(combined);
}