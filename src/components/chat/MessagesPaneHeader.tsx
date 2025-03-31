import { Typography } from '@mui/joy';
import { Box } from '@mui/material';
import { TChannelProps } from '@/types';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from 'react';
import ChannelInfoModal from './ChannelInfoModal';
import ToggleSidebarButton from '../common/header/ToggleSidebarButton';
import ToggleAiPannelButton from '../common/header/ToggleAiPannelButton';

type TMessagesPaneHeaderProps = {
  channel: TChannelProps;
};

const MessagesPaneHeader = ({ channel }: TMessagesPaneHeaderProps) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleInfoOpen = () => {
    setIsInfoOpen(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 2,
        backgroundColor: 'var(--joy-palette-background-surface)',
        borderBottom: '1px solid var(--joy-palette-neutral-300)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ToggleSidebarButton />
        <Typography fontSize={{ xs: 'md', md: 'lg' }} fontWeight="lg">
          {channel.channelName}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoIcon
          sx={{
            cursor: 'pointer',
          }}
          onClick={handleInfoOpen}
        />
        <ToggleAiPannelButton />
      </Box>
      <ChannelInfoModal
        open={isInfoOpen}
        setOpen={setIsInfoOpen}
        channelInfo={channel}
      />
    </Box>
  );
};

export default MessagesPaneHeader;
