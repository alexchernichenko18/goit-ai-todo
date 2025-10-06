import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box } from '@mui/material';
import { ITodo } from '../../utils/types';
import TodoItem from '../../components/TodoItem/TodoItem';
import { useUi } from '../../app/store/useUI';

type Props = {
  items: ITodo[];
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
};

export default function TodoListView({ items, onToggle, onEdit, onReorder }: Props) {
  const aiEnabled = useUi((s) => s.aiEnabled);
  const setAiEnabled = useUi((s) => s.setAiEnabled);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragStart = (_e: DragStartEvent) => {
    if (aiEnabled) setAiEnabled(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === String(active.id));
    const to = items.findIndex((i) => i.id === String(over.id));
    if (from === -1 || to === -1) return;
    onReorder(from, to);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <Box>
          {items.map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              onToggleComplete={onToggle}
              onEdit={onEdit}
            />
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
}
