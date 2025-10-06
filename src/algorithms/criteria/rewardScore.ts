import { ITodo } from '../../utils/types';

export type CriterionCtx = { now: number };

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export default function rewardScore(t: ITodo, _ctx: CriterionCtx): number {
  return clamp01(t.importance ?? 0.5);
}