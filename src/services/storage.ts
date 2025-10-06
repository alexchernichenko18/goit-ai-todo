import { ITodo } from '../utils/types';

const TODOS_KEY = 'ai_todo_items_v1';
const UI_KEY = 'ai_ui_v1';
const MODEL_KEY = 'ai_model_v1';

// === Todos ===
export const loadTodos = (): ITodo[] | null => {
  try {
    const raw = localStorage.getItem(TODOS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ITodo[];
  } catch {
    return null;
  }
};

export const saveTodos = (items: ITodo[]): void => {
  try {
    localStorage.setItem(TODOS_KEY, JSON.stringify(items));
  } catch { }
};

// === UI ===
export const loadUiState = (): boolean => {
  try {
    return localStorage.getItem(UI_KEY) === 'true';
  } catch {
    return false;
  }
};

export const saveUiState = (enabled: boolean): void => {
  try {
    localStorage.setItem(UI_KEY, String(enabled));
  } catch { }
};

// === Algo Model ===
export const loadAlgoModel = <T>(): T | null => {
  try {
    const raw = localStorage.getItem(MODEL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const saveAlgoModel = (model: unknown): void => {
  try {
    localStorage.setItem(MODEL_KEY, JSON.stringify(model));
  } catch { }
};