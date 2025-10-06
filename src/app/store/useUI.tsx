import { create } from 'zustand';
import { loadUiState, saveUiState } from '../../services/storage';

type UiStore = {
  aiEnabled: boolean;
  setAiEnabled: (v: boolean) => void;
  toggleAiEnabled: () => void;
};

export const useUi = create<UiStore>((set, get) => ({
  aiEnabled: loadUiState(),
  setAiEnabled: (v) => { saveUiState(v); set({ aiEnabled: v }); },
  toggleAiEnabled: () => { const next = !get().aiEnabled; saveUiState(next); set({ aiEnabled: next }); },
}));
