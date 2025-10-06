import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';
import { clamp01 } from '../../utils';

export default function locationFit(todo: ITodo, ctx: ScoringContext): number {
  const nowHour = new Date(ctx.now).getHours();

  const base =
    todo.location === 'home' && (nowHour < 9 || nowHour > 20)
      ? 1
      : todo.location === 'office' && nowHour >= 9 && nowHour <= 18
        ? 1
        : todo.location === 'outdoor' && nowHour >= 10 && nowHour <= 19
          ? 0.9
          : 0.5;

  const tagBonus =
    todo.tag === 'work' && todo.location === 'office'
      ? 0.1
      : todo.tag === 'home' && todo.location === 'home'
        ? 0.1
        : 0;

  const energyMatch =
    todo.energy === 'high' && todo.location === 'outdoor'
      ? 0.1
      : todo.energy === 'low' && todo.location === 'home'
        ? 0.05
        : 0;

  const noisePenalty =
    todo.location === 'office' && (nowHour < 8 || nowHour > 20) ? -0.1 : 0;

  const fit = base + tagBonus + energyMatch + noisePenalty;
  return clamp01(fit);
}