import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Paper,
  Typography,
  Checkbox,
  IconButton,
  Stack
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditIcon from '@mui/icons-material/Edit';
import { ITodo } from '../../utils/types';

interface ITodoItem {
  item: ITodo;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  dragDisabled?: boolean;
}

export default function TodoItem({
  item,
  onToggleComplete,
  onEdit,
  dragDisabled = false
}: ITodoItem) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isSorting } =
    useSortable({
      id: item.id,
      disabled: dragDisabled
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSorting ? 0.85 : 1,
    cursor: dragDisabled ? 'default' : 'grab'
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      variant="outlined"
      sx={{
        p: 1.5,
        mb: 1.5,
        borderRadius: 2,
        bgcolor: 'background.paper',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Checkbox
        checked={item.completed}
        onChange={() => onToggleComplete(item.id)}
        sx={{ mr: 1 }}
      />
      <Typography
        variant="body1"
        color="text.primary"
        sx={{
          flex: 1,
          textDecoration: item.completed ? 'line-through' : 'none',
          opacity: item.completed ? 0.6 : 1
        }}
      >
        {item.title}
      </Typography>
      <IconButton
        aria-label="edit"
        onClick={() => onEdit(item.id)}
        size="small"
        sx={{ color: 'text.secondary' }}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        aria-label="drag"
        size="small"
        ref={setActivatorNodeRef}
        {...(!dragDisabled ? listeners : {})}
        {...(!dragDisabled ? attributes : {})}
        disabled={dragDisabled}
        sx={{
          color: 'text.secondary',
          cursor: dragDisabled ? 'default' : 'grab',
          '&:hover': { color: 'text.primary' }
        }}
      >
        <DragIndicatorIcon />
      </IconButton>
    </Paper>
  );
}
