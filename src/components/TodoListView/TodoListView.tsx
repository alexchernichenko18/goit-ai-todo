import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  DragEndEvent, DragStartEvent
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box } from '@mui/material';
import TodoItem from '../TodoItem/TodoItem';
import { ITodo } from '../../utils/types';
import { useUi } from '../../app/store/useUI';
import { useTodoItems } from '../../app/store/useTodoItems';

type Props = {
  items: ITodo[];
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
};

export default function TodoListView({ items, onToggle, onEdit }: Props) {
  const aiEnabled = useUi(s => s.aiEnabled);
  const setAiEnabled = useUi(s => s.setAiEnabled);
  const reorderWithinGroup = useTodoItems(s => s.reorderWithinGroup);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const activeItems = items.filter(t => !t.completed);
  const completedItems = items.filter(t => t.completed);

  const handleDragStart = (_e: DragStartEvent) => {
    if (aiEnabled) setAiEnabled(false);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    reorderWithinGroup('active', String(active.id), String(over.id));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={activeItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <Box>
          {activeItems.map(item => (
            <TodoItem
              key={item.id}
              item={item}
              onToggleComplete={onToggle}
              onEdit={onEdit}
              dragDisabled={aiEnabled}
            />
          ))}
        </Box>
      </SortableContext>

      {completedItems.length > 0 && (
        <Box>
          {completedItems.map(item => (
            <TodoItem
              key={item.id}
              item={item}
              onToggleComplete={onToggle}
              onEdit={onEdit}
              dragDisabled
            />
          ))}
        </Box>
      )}
    </DndContext>
  );
}