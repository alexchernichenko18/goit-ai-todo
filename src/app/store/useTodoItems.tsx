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
  reorderByIds: (activeId: string, overId: string) => void; // якщо десь ще використовуєш
  reorderWithinGroup: (group: 'active' | 'completed', activeId: string, overId: string) => void;
  replaceAll: (items: ITodo[]) => void;
};

const initItems = loadTodos() ?? [];

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
    const next = get()
      .items
      .map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
    saveTodos(next);
    set({ items: next });
  },

  edit: (id, patch) => {
    const next = get().items.map((t) =>
      t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
    );
    saveTodos(next);
    set({ items: next });
  },

  reorderByIds: (activeId, overId) => {
    const items = get().items;
    const from = items.findIndex((x) => x.id === activeId);
    const to = items.findIndex((x) => x.id === overId);
    if (from < 0 || to < 0) return;
    const next = arrayMove(items, from, to)
      .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
    saveTodos(next);
    set({ items: next });
  },

  reorderWithinGroup: (group, activeId, overId) => {
    const items = get().items;
    const activeList = items.filter((t) => !t.completed);
    const completedList = items.filter((t) => t.completed);

    const list = group === 'active' ? activeList : completedList;
    const from = list.findIndex((t) => t.id === activeId);
    const to = list.findIndex((t) => t.id === overId);
    if (from < 0 || to < 0) return;

    const reordered = arrayMove(list, from, to);
    const next = group === 'active'
      ? [...reordered, ...completedList]
      : [...activeList, ...reordered];

    saveTodos(next);
    set({ items: next });
  },

  replaceAll: (items) => {
    saveTodos(items);
    set({ items });
  }
}));