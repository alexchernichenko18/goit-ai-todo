import { Fab } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useUi } from '../../app/store/useUI';

export default function AiSortingFab() {
  const aiEnabled = useUi((s) => s.aiEnabled);
  const toggleAiEnabled = useUi((s) => s.toggleAiEnabled);

  return (
    <Fab
      color={aiEnabled ? 'primary' : 'default'}
      onClick={toggleAiEnabled}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        px: 3,
        backgroundColor: aiEnabled ? 'primary.dark' : 'white',
        color: aiEnabled ? 'white' : 'text.primary',
        '&:hover': { backgroundColor: aiEnabled ? 'primary.main' : 'grey.100' },
      }}
      variant="extended"
    >
      <AutoAwesomeIcon sx={{ mr: 1 }} />
      AI Sorting
    </Fab>
  );
}