import { create } from 'zustand';

type UiStore = {
  aiEnabled: boolean;
  setAiEnabled: (v: boolean) => void;
  toggleAiEnabled: () => void;
};

export const useUi = create<UiStore>((set, get) => ({
  aiEnabled: false,
  setAiEnabled: (v) => set({ aiEnabled: v }),
  toggleAiEnabled: () => set({ aiEnabled: !get().aiEnabled })
}));
