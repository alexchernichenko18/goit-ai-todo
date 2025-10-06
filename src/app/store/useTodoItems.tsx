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

const init = (loadTodos() ?? []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export const useTodoItems = create<Store>((set, get) => ({
  items: init,

  add: (t) => {
    const next = [t, ...get().items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    saveTodos(next);
    set({ items: next });
  },

  remove: (id) => {
    const next = get().items.filter((x) => x.id !== id);
    saveTodos(next);
    set({ items: next });
  },

  toggle: (id) => {
    const next = get()
      .items
      .map((x) => (x.id === id ? { ...x, completed: !x.completed } : x))
      .sort((a, b) => {
        if (a.completed === b.completed) return (a.order ?? 0) - (b.order ?? 0);
        return a.completed ? 1 : -1;
      });
    saveTodos(next);
    set({ items: next });
  },

  edit: (id, patch) => {
    const next = get()
      .items
      .map((x) =>
        x.id === id ? { ...x, ...patch, updatedAt: new Date().toISOString() } : x
      )
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    saveTodos(next);
    set({ items: next });
  },

  reorderWithinGroup: (_group, fromId, toId) => {
    const all = get().items;
    const active = all.filter((x) => !x.completed).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const completed = all.filter((x) => x.completed);

    const fromIdx = active.findIndex((x) => x.id === fromId);
    const toIdx = active.findIndex((x) => x.id === toId);
    if (fromIdx === -1 || toIdx === -1) return;

    const reordered = [...active];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    const nextActive = reordered.map((x, i) => ({ ...x, order: i }));
    const nextCompleted = completed.map((x, i) => ({
      ...x,
      order: nextActive.length + i,
    }));

    const next = [...nextActive, ...nextCompleted];
    saveTodos(next);
    set({ items: next });
  },
}));