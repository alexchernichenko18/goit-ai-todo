import { useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
  Box,
  Container,
  Typography,
  Button
} from '@mui/material';
import TodoItem from './components/TodoItem/TodoItem';
import TodoDialog from './components/TodoDialog/TodoDialog';
import { useTodoItems } from './app/store/useTodoItems';
import { ITodo, Tag } from './utils/types';
import { createTodo } from './utils/todoFactory';

export default function App() {
  const items = useTodoItems((s) => s.items);
  const add = useTodoItems((s) => s.add);
  const toggle = useTodoItems((s) => s.toggle);
  const edit = useTodoItems((s) => s.edit);
  const reorder = useTodoItems((s) => s.reorder);
  const remove = useTodoItems((s) => s.remove);

  useMemo<ITodo[]>(() => items, [items]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ITodo | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === String(active.id));
    const newIndex = items.findIndex((i) => i.id === String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    reorder(oldIndex, newIndex);
  };

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    const t = items.find((x) => x.id === id) || null;
    setEditing(t);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleSave = (payload: {
    title: string;
    description: string;
    deadline: string | '';
    importance: number;
    estimateMinutes: number;
    tag: Tag;
  }) => {
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
  };

  const handleDelete = (id: string) => {
    remove(id);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
            To-do list
          </Typography>
          <Button variant="contained" onClick={openAdd}>Add task</Button>
        </Box>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <Box>
              {items.map((item) => (
                <TodoItem
                  key={item.id}
                  item={item}
                  onToggleComplete={(id) => toggle(id)}
                  onEdit={openEdit}
                />
              ))}
            </Box>
          </SortableContext>
        </DndContext>

        <TodoDialog
          open={dialogOpen}
          todo={editing}
          onClose={closeDialog}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </Container>
    </Box>
  );
}