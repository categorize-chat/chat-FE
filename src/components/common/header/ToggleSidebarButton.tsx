import { IconButton } from '@mui/joy';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { useUIStore } from '@/state/ui';

const ToggleSidebarButton = () => {
  const { toggleSidebar } = useUIStore();

  return (
    <IconButton
      onClick={toggleSidebar}
      variant="outlined"
      color="neutral"
      size="sm"
      sx={{
        display: { xs: 'flex', sm: 'none' },
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MenuRoundedIcon />
    </IconButton>
  );
};

export default ToggleSidebarButton;
