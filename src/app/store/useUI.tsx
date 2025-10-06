import { create } from 'zustand';

type UiStore = {
  aiEnabled: boolean;
  setAiEnabled: (v: boolean) => void;
  toggleAiEnabled: () => void;
};

export const useUi = create<UiStore>((set) => ({
  aiEnabled: false,
  setAiEnabled: (v) => set({ aiEnabled: v }),
  toggleAiEnabled: () => set((s) => ({ aiEnabled: !s.aiEnabled })),
}));
