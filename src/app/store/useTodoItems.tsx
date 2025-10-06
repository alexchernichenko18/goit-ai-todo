import { create } from 'zustand';
import { ITodo } from '../../utils/types';
import { loadTodos, saveTodos } from '../../services/storage';

type Store = {
  items: ITodo[];
  add: (t: ITodo) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  edit: (id: string, patch: Partial<ITodo>) => void;
  reorderWithinGroup: (group: 'active', fromId: string, toId: string) => void;
};

const init = loadTodos() ?? [];

export const useTodoItems = create<Store>((set, get) => ({
  items: init,

  add: (t) => {
    const next = [t, ...get().items];
    saveTodos(next);
    set({ items: next });
  },

  remove: (id) => {
    const next = get().items.filter(x => x.id !== id);
    saveTodos(next);
    set({ items: next });
  },

  toggle: (id) => {
    const next = get()
      .items
      .map(x => x.id === id ? { ...x, completed: !x.completed } : x)
      .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
    saveTodos(next);
    set({ items: next });
  },

  edit: (id, patch) => {
    const next = get().items.map(x =>
      x.id === id ? { ...x, ...patch, updatedAt: new Date().toISOString() } : x
    );
    saveTodos(next);
    set({ items: next });
  },

  reorderWithinGroup: (_group, fromId, toId) => {
    const all = get().items;

    const active = all.filter(x => !x.completed);
    const completed = all.filter(x => x.completed);

    const ids = active.map(x => x.id);
    const fromIdx = ids.indexOf(fromId);
    const toIdx = ids.indexOf(toId);
    if (fromIdx === -1 || toIdx === -1) return;

    const reorderedIds = [...ids];
    const [moved] = reorderedIds.splice(fromIdx, 1);
    reorderedIds.splice(toIdx, 0, moved);

    const byId = new Map(all.map(x => [x.id, x]));
    const nextActive = reorderedIds.map(id => byId.get(id)!);
    const next = [...nextActive, ...completed];

    saveTodos(next);
    set({ items: next });
  },
}));
