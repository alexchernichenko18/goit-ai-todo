import { clamp01 } from '../../utils';
import { ITodo, Tag, EnergyLevel, LocationType } from '../../utils/types';
import { ScoringContext, TimeSlot } from '../types';

const w = {
  tag: 0.45,
  energy: 0.2,
  slot: 0.2,
  location: 0.1,
  keywords: 0.05
};

const tagAffinity: Record<Tag, Record<Tag, number>> = {
  general: { general: 1, work: 0.6, home: 0.6, study: 0.6 },
  work: { general: 0.6, work: 1, home: 0.35, study: 0.7 },
  home: { general: 0.6, work: 0.35, home: 1, study: 0.5 },
  study: { general: 0.6, work: 0.7, home: 0.5, study: 1 }
};

const energyAffinity: Record<EnergyLevel, Record<EnergyLevel, number>> = {
  low: { low: 1, medium: 0.6, high: 0.25 },
  medium: { low: 0.7, medium: 1, high: 0.6 },
  high: { low: 0.3, medium: 0.7, high: 1 }
};

const slotAffinity: Record<TimeSlot, Record<TimeSlot, number>> = {
  morning: { morning: 1, day: 0.8, evening: 0.5, night: 0.3 },
  day: { morning: 0.8, day: 1, evening: 0.7, night: 0.3 },
  evening: { morning: 0.5, day: 0.7, evening: 1, night: 0.4 },
  night: { morning: 0.3, day: 0.3, evening: 0.4, night: 1 }
};

const locationAffinity: Record<LocationType, Record<LocationType, number>> = {
  any: { any: 1, home: 1, office: 1, outdoor: 1 },
  home: { any: 0.9, home: 1, office: 0.5, outdoor: 0.6 },
  office: { any: 0.9, home: 0.5, office: 1, outdoor: 0.6 },
  outdoor: { any: 0.8, home: 0.6, office: 0.6, outdoor: 1 }
};

const keywordPools: Record<Tag, string[]> = {
  general: ['misc', 'quick', 'note', 'reminder'],
  work: ['report', 'meeting', 'client', 'deploy', 'release', 'review'],
  home: ['clean', 'cook', 'buy', 'fix', 'family'],
  study: ['read', 'course', 'lecture', 'exercise', 'practice']
};

const scoreKeywords = (text: string, tag: Tag): number => {
  const pool = keywordPools[tag] ?? [];
  if (!text) return 0;
  const t = text.toLowerCase();
  let hits = 0;
  for (const k of pool) if (t.includes(k)) hits += 1;
  return clamp01(hits / Math.max(3, pool.length));
};

export default function contextFit(todo: ITodo, ctx: ScoringContext): number {
  const tagA =
    tagAffinity[(todo.tag ?? 'general') as Tag]?.[(todo.tag ?? 'general') as Tag] ?? 0.6;

  const energyA =
    energyAffinity[(todo.energy ?? 'medium') as EnergyLevel]?.[(todo.energy ?? 'medium') as EnergyLevel] ?? 0.6;

  const slotA =
    slotAffinity[ctx.slot]?.[ctx.slot] ?? 0.6;

  const locationA =
    locationAffinity[(todo.location ?? 'any') as LocationType]?.[(todo.location ?? 'any') as LocationType] ?? 0.8;

  const kw =
    scoreKeywords(`${todo.title} ${todo.description ?? ''}`, (todo.tag ?? 'general') as Tag);

  const s =
    w.tag * tagA +
    w.energy * energyA +
    w.slot * slotA +
    w.location * locationA +
    w.keywords * kw;

  return clamp01(s);
}