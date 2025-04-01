import { useUIStore } from '@/state/ui';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { IconButton } from '@mui/joy';

const ToggleAiPannelButton = () => {
  const { toggleAiPannel } = useUIStore();

  return (
    <IconButton
      sx={{
        cursor: 'pointer',
        display: { xs: 'flex', sm: 'none' },
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={toggleAiPannel}
      variant="outlined"
    >
      <SmartToyIcon />
    </IconButton>
  );
};

export default ToggleAiPannelButton;
