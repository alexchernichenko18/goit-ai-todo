import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { ITodo } from '../../utils/types';
import { loadTodos, saveTodos } from '../../services/storage';

type TodoItemsStore = {
  items: ITodo[];
  add: (item: ITodo) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  edit: (id: string, patch: Partial<ITodo>) => void;
  reorder: (fromIndex: number, toIndex: number) => void;
  replaceAll: (items: ITodo[]) => void;
};

const normalize = (list: ITodo[]) => {
  const active = list.filter(t => !t.completed);
  const done = list.filter(t => t.completed);
  return [...active, ...done];
};

const persist = (items: ITodo[]) => {
  const next = normalize(items);
  saveTodos(next);
  return next;
};

const initItems = normalize(loadTodos() ?? []);

export const useTodoItems = create<TodoItemsStore>((set, get) => ({
  items: initItems,

  add: (item) => {
    const next = persist([item, ...get().items]);
    set({ items: next });
  },

  remove: (id) => {
    const next = persist(get().items.filter(t => t.id !== id));
    set({ items: next });
  },

  toggle: (id) => {
    const toggled = get().items.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    const next = persist(toggled);
    set({ items: next });
  },

  edit: (id, patch) => {
    const edited = get().items.map(t =>
      t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
    );
    const next = persist(edited);
    set({ items: next });
  },

  reorder: (fromIndex, toIndex) => {
    const moved = arrayMove(get().items, fromIndex, toIndex);
    const next = persist(moved);
    set({ items: next });
  },

  replaceAll: (items) => {
    const next = persist(items);
    set({ items: next });
  }
}));
