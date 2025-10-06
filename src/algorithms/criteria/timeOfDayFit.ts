import { clamp01 } from '../../utils';
import { ITodo } from '../../utils/types';
import { ScoringContext, TimeSlot } from '../types';

const energyPref: Record<string, Record<TimeSlot, number>> = {
  high: { morning: 1, day: 0.85, evening: 0.45, night: 0.15 },
  medium: { morning: 0.8, day: 1, evening: 0.7, night: 0.25 },
  low: { morning: 0.4, day: 0.6, evening: 1, night: 0.7 }
};

const tagPref: Record<string, Record<TimeSlot, number>> = {
  work: { morning: 0.85, day: 1, evening: 0.35, night: 0.1 },
  home: { morning: 0.4, day: 0.55, evening: 1, night: 0.75 },
  study: { morning: 1, day: 0.7, evening: 0.8, night: 0.35 },
  general: { morning: 0.7, day: 0.7, evening: 0.7, night: 0.5 }
};

const durationSuitability = (slot: TimeSlot, minutes: number) => {
  const m = Math.max(1, minutes || 30);
  const long = m >= 90 ? 1 : 0;
  const short = m <= 30 ? 1 : 0;
  if (slot === 'morning') return clamp01(0.4 * short + 1.0 * long + 0.6);
  if (slot === 'day') return clamp01(0.5 * short + 1.0 * long + 0.6);
  if (slot === 'evening') return clamp01(1.0 * short + 0.6 * long + 0.4);
  return clamp01(1.0 * short + 0.2 * long + 0.3);
};

const deadlineBoost = (nowMs: number, deadline?: string | null) => {
  if (!deadline) return 0;
  const diffH = (new Date(deadline).getTime() - nowMs) / 36e5;
  if (diffH < 0) return 0;
  if (diffH <= 6) return 0.2;
  if (diffH <= 12) return 0.1;
  return 0;
};

const nightPenalty = (slot: TimeSlot, energy?: string, estimate?: number) => {
  if (slot !== 'night') return 0;
  const short = (estimate || 30) <= 30 ? 1 : 0;
  if (short) return 0.05;
  if (energy === 'high') return 0.25;
  if (energy === 'medium') return 0.15;
  return 0.08;
};

export default function timeOfDayFit(todo: ITodo, ctx: ScoringContext): number {
  const slot = ctx.slot;
  const e = todo.energy || 'medium';
  const tag = todo.tag || 'general';

  const eScore = energyPref[e]?.[slot] ?? 0.6;
  const tScore = tagPref[tag]?.[slot] ?? 0.6;
  const dScore = durationSuitability(slot, todo.estimateMinutes ?? 30);
  const dBoost = deadlineBoost(ctx.now, todo.deadline);
  const nPenalty = nightPenalty(slot, todo.energy, todo.estimateMinutes);

  const base = 0.45 * eScore + 0.35 * tScore + 0.2 * dScore;
  const score = clamp01(base + dBoost - nPenalty);
  return score;
}