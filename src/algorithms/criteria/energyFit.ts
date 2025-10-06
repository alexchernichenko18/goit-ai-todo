import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';
import { clamp01 } from '../../utils';

export default function energyFit(todo: ITodo, _ctx: ScoringContext): number {
  const energy = todo.energy ?? 'medium';
  const estimate = todo.estimateMinutes ?? 30;

  let score = 0.5;

  if (energy === 'high') {
    score = estimate > 45 ? 1.0 : 0.7;
  } else if (energy === 'medium') {
    score = estimate > 60 ? 0.6 : 0.8;
  } else if (energy === 'low') {
    score = estimate > 30 ? 0.3 : 0.7;
  }

  const fatigueFactor = Math.random() * 0.1 - 0.05;
  return clamp01(score + fatigueFactor);
}