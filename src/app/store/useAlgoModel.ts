import { create } from 'zustand';
import { EnergyLevel, Tag } from '../../utils/types';
import { loadAlgoModel, saveAlgoModel } from '../../services/storage';

export type TimeSlot = 'morning' | 'day' | 'evening' | 'night';

type Store = {
  tagWeights: Record<Tag, number>;
  energyWeights: Record<EnergyLevel, number>;
  timeOfDayWeights: Record<TimeSlot, number>;

  boost: (p: { tag?: Tag; energy?: EnergyLevel; slot?: TimeSlot; delta?: number }) => void;
  reset: () => void;
};

const defaults: Pick<Store, 'tagWeights' | 'energyWeights' | 'timeOfDayWeights'> = {
  tagWeights: { general: 0, work: 0, home: 0, study: 0 },
  energyWeights: { low: 0, medium: 0, high: 0 },
  timeOfDayWeights: { morning: 0, day: 0, evening: 0, night: 0 }
};

const saved = loadAlgoModel<typeof defaults>() ?? defaults;

export const useAlgoModel = create<Store>((set, get) => ({
  ...saved,

  boost: ({ tag, energy, slot, delta = 0.05 }) => {
    const s = get();
    const next = {
      tagWeights: { ...s.tagWeights },
      energyWeights: { ...s.energyWeights },
      timeOfDayWeights: { ...s.timeOfDayWeights }
    };

    if (tag) next.tagWeights[tag] = (next.tagWeights[tag] ?? 0) + delta;
    if (energy) next.energyWeights[energy] = (next.energyWeights[energy] ?? 0) + delta;
    if (slot) next.timeOfDayWeights[slot] = (next.timeOfDayWeights[slot] ?? 0) + delta;

    saveAlgoModel(next);
    set(next);
  },

  reset: () => {
    saveAlgoModel(defaults);
    set({ ...defaults });
  }
}));
