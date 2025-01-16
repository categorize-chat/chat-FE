import { Typography } from '@mui/joy';
import { Box } from '@mui/material';
import { TChannelProps } from '../../utils/chat/type';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from 'react';

type TMessagesPaneHeaderProps = {
  channel: TChannelProps;
};

const MessagesPaneHeader = ({ channel }: TMessagesPaneHeaderProps) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const handleInfoOpen = () => {
    setIsInfoOpen(true);
  };

  const handleInfoClose = () => {
    setIsInfoOpen(false);
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
      <Typography fontSize={{ xs: 'md', md: 'lg' }} fontWeight="lg">
        {channel.channelName}
      </Typography>

      <InfoIcon
        sx={{
          cursor: 'pointer',
        }}
        onClick={handleInfoOpen}
      />
    </Box>
  );
};

export default MessagesPaneHeader;
