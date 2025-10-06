import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';
import { clamp01 } from '../../utils';

const w = {
  hasDeps: 0.3,
  depsDone: 0.5,
  depsRecency: 0.2
};

export default function dependencyReadiness(todo: ITodo, ctx: ScoringContext): number {
  const deps = todo.dependencyIds || [];
  if (deps.length === 0) return 1;

  const completedDeps = deps.filter(id => id.startsWith('done_')).length;
  const ratio = completedDeps / deps.length;

  const recencyFactor = clamp01((ctx.now % 1000000) / 1000000);
  const base =
    w.hasDeps * (1 - clamp01(deps.length / 10)) +
    w.depsDone * ratio +
    w.depsRecency * recencyFactor;

  return clamp01(base);
}