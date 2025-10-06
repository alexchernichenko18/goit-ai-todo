import { Box, Container } from '@mui/material';
import { useTodoItems } from './app/store/useTodoItems';
import { useAiSortedTodos } from './algorithms/useAiSortedTodos';
import { useUi } from './app/store/useUI';
import HeaderBar from './components/HeaderBar/HeaderBar';
import TodoListView from './components/TodoListView/TodoListView';
import TodoDialog from './components/TodoDialog/TodoDialog';
import AiSortingFab from './components/AiSortingFab/AiSortingFab';
import { useTodoDialog } from './utils/hooks/useTodoDialog';
import { Tag } from './utils/types';

export default function App() {
  const items = useTodoItems((s) => s.items);
  const add = useTodoItems((s) => s.add);
  const toggle = useTodoItems((s) => s.toggle);
  const edit = useTodoItems((s) => s.edit);
  const reorder = useTodoItems((s) => s.reorder);
  const remove = useTodoItems((s) => s.remove);

  const { open, editing, openAdd, openEdit, close, save, del } = useTodoDialog({ items, add, edit, remove });

  const aiEnabled = useUi((s) => s.aiEnabled);
  const sorted = useAiSortedTodos(items);
  const visible = aiEnabled ? sorted : items;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6, position: 'relative' }}>
      <Container maxWidth="sm">
        <HeaderBar onAdd={openAdd} />
        <TodoListView
          items={visible}
          onToggle={toggle}
          onEdit={openEdit}
          onReorder={reorder}
        />
        <TodoDialog
          open={open}
          todo={editing}
          onClose={close}
          onSave={(p: { title: string; description: string; deadline: string | ''; importance: number; estimateMinutes: number; tag: Tag }) => save(p)}
          onDelete={(id) => del(id)}
        />
      </Container>
      <AiSortingFab />
    </Box>
  );
}
