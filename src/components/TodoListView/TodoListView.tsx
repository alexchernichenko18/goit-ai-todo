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

  const handleDragStart = (e: DragStartEvent) => {
    if (aiEnabled) setAiEnabled(false);
    console.log('[DND] start', {
      activeId: String(e.active?.id),
      itemsActive: activeItems.map(i => i.id),
      pointerType: (e.activatorEvent as any)?.pointerType,
    });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    console.log('[DND] end', {
      activeId: String(active?.id),
      overId: over ? String(over.id) : null,
      before: activeItems.map(i => i.id),
    });

    if (!over || active.id === over.id) {
      console.log('[DND] skip: over is null or same id');
      return;
    }

    reorderWithinGroup('active', String(active.id), String(over.id));

    const after = useTodoItems.getState().items.filter(i => !i.completed).map(i => i.id);
    console.log('[DND] after', { after });
  };
  console.log('items', items);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={activeItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <Box>
          {activeItems.map((item, index) => (
            <TodoItem
              key={item.id + index + item.title}
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
          {completedItems.map((item, index) => (
            <TodoItem
              key={item.id + index + item.title}
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