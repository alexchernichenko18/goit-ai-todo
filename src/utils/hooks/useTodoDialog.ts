import { useState } from 'react';
import { ITodo, Tag } from '../../utils/types';
import { createTodo } from '../../utils/todoFactory';

type SavePayload = {
  title: string;
  description: string;
  deadline: string | '';
  importance: number;
  estimateMinutes: number;
  tag: Tag;
};

type Params = {
  items: ITodo[];
  add: (t: ITodo) => void;
  edit: (id: string, patch: Partial<ITodo>) => void;
  remove: (id: string) => void;
};

export function useTodoDialog({ items, add, edit, remove }: Params) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ITodo | null>(null);

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (id: string) => {
    const t = items.find((x) => x.id === id) || null;
    setEditing(t);
    setOpen(true);
  };

  const close = () => setOpen(false);

  const save = (payload: SavePayload) => {
    if (editing) {
      edit(editing.id, {
        title: payload.title,
        description: payload.description,
        deadline: payload.deadline || null,
        importance: payload.importance,
        estimateMinutes: payload.estimateMinutes,
        tag: payload.tag,
        updatedAt: new Date().toISOString()
      });
    } else {
      const todo = createTodo(payload);
      add(todo);
    }
    close();
  };

  const del = (id: string) => {
    remove(id);
    close();
  };

  return { open, editing, openAdd, openEdit, close, save, del };
}
