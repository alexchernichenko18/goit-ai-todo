import { ITodo } from '../utils/types';

const KEY = 'ai_todo_items_v1';

export const loadTodos = (): ITodo[] | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ITodo[];
  } catch {
    return null;
  }
};

export const saveTodos = (items: ITodo[]): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch { }
};
