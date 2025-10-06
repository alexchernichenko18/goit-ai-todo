import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { ITodo } from '../../utils/types';
import { loadTodos, saveTodos } from '../../services/storage';

export type TodoItemsStore = {
  items: ITodo[];
  add: (item: ITodo) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  edit: (id: string, patch: Partial<ITodo>) => void;
  reorder: (fromIndex: number, toIndex: number) => void;
  replaceAll: (items: ITodo[]) => void;
};

const initItems = loadTodos() ?? [];

const sortCompletedBottom = (arr: ITodo[]) =>
  [...arr].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

export const useTodoItems = create<TodoItemsStore>((set, get) => ({
  items: initItems,
  add: (item) => {
    const next = [item, ...get().items];
    saveTodos(next);
    set({ items: next });
  },
  remove: (id) => {
    const next = get().items.filter((t) => t.id !== id);
    saveTodos(next);
    set({ items: next });
  },
  toggle: (id) => {
    const next = get().items
      .map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    const sorted = sortCompletedBottom(next);
    saveTodos(sorted);
    set({ items: sorted });
  },
  edit: (id, patch) => {
    const next = get().items.map((t) =>
      t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
    );
    saveTodos(next);
    set({ items: next });
  },
  reorder: (fromIndex, toIndex) => {
    const src = get().items;
    const next = arrayMove(src, fromIndex, toIndex);
    const sorted = sortCompletedBottom(next);
    saveTodos(sorted);
    set({ items: sorted });
  },
  replaceAll: (items) => {
    saveTodos(items);
    set({ items });
  }
}));
