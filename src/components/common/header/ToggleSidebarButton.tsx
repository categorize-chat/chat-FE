import { IconButton } from '@mui/joy';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { useUIStore } from '@/state/ui';

type TToggleSidebarButtonProps = {
  float?: boolean;
};

const ToggleSidebarButton = ({ float = false }: TToggleSidebarButtonProps) => {
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
        ...(float && {
          position: 'fixed',
          top: 10,
          left: 10,
          zIndex: 1000,
        }),
      }}
    >
      <MenuRoundedIcon />
    </IconButton>
  );
};

export default ToggleSidebarButton;
