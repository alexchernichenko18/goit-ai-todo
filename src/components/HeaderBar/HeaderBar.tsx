import { Box, Button, Typography } from '@mui/material';

type Props = { onAdd: () => void };

export default function HeaderBar({ onAdd }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
        To-do list
      </Typography>
      <Button variant="contained" onClick={onAdd}>Add task</Button>
    </Box>
  );
}