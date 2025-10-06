import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';
import { clamp01 } from '../../utils';

export default function sessionLengthFit(todo: ITodo, _ctx: ScoringContext): number {
  const estimate = todo.estimateMinutes ?? 30;
  const targetSession = 45;
  const diff = Math.abs(estimate - targetSession);
  const fit = 1 - clamp01(diff / targetSession);

  const multiplier =
    estimate < 15 ? 0.8 :
      estimate < 30 ? 1.0 :
        estimate < 60 ? 0.9 :
          estimate < 120 ? 0.7 : 0.5;

  return clamp01(fit * multiplier);
}