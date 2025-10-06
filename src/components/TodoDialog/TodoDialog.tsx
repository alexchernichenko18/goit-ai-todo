import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Slider,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { ITodo, Tag } from '../../utils/types';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';

type Props = {
  open: boolean;
  todo: ITodo | null;
  onClose: () => void;
  onSave: (payload: {
    title: string;
    description: string;
    deadline: string | '';
    importance: number;
    estimateMinutes: number;
    tag: Tag;
  }) => void;
  onDelete?: (id: string) => void;
};

export default function TodoDialog({ open, todo, onClose, onSave, onDelete }: Props) {
  const isEdit = Boolean(todo);

  const initial = useMemo(
    () => ({
      title: todo?.title ?? '',
      description: todo?.description ?? '',
      deadline: todo?.deadline ?? '',
      importance: todo?.importance ?? 0.5,
      estimateMinutes: todo?.estimateMinutes ?? 30,
      tag: (todo?.tag as Tag) ?? 'general'
    }),
    [todo]
  );

  const [form, setForm] = useState(initial);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open) setForm(initial);
  }, [open, initial]);

  const handleClose = () => {
    if (!isEdit) {
      setForm({
        title: '',
        description: '',
        deadline: '',
        importance: 0.5,
        estimateMinutes: 30,
        tag: 'general'
      });
    }
    onClose();
  };

  const handleSave = () => {
    onSave(form);
    handleClose();
  };

  const requestDelete = () => {
    if (!todo || !onDelete) return;
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!todo || !onDelete) return;
    onDelete(todo.id);
    setConfirmOpen(false);
    handleClose();
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit ? 'Edit task' : 'Add new task'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              fullWidth
              autoFocus
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
            <TextField
              label="Deadline"
              type="datetime-local"
              value={form.deadline || ''}
              onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl fullWidth>
                <InputLabel id="tag-label">Tag</InputLabel>
                <Select
                  labelId="tag-label"
                  label="Tag"
                  value={form.tag}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tag: e.target.value as Tag }))
                  }
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="work">Work</MenuItem>
                  <MenuItem value="home">Home</MenuItem>
                  <MenuItem value="study">Study</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Estimate, min"
                type="number"
                value={form.estimateMinutes}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    estimateMinutes: Number(e.target.value) || 0
                  }))
                }
                inputProps={{ min: 0 }}
                sx={{ width: 180 }}
              />
            </Stack>
            <Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <span>Importance</span>
                <span>{form.importance.toFixed(1)}</span>
              </Stack>
              <Slider
                value={form.importance}
                min={0}
                max={1}
                step={0.1}
                onChange={(_, v) => setForm((p) => ({ ...p, importance: Number(v) }))}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          {isEdit ? (
            <Button onClick={requestDelete} color="error" variant="outlined">
              Delete
            </Button>
          ) : (
            <span />
          )}
          <Stack direction="row" spacing={1}>
            <Button onClick={handleClose} variant="outlined">Cancel</Button>
            <Button onClick={handleSave} variant="contained">
              {isEdit ? 'Save changes' : 'Add task'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete task?"
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}
