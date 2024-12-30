import { Avatar, Box } from '@mui/joy';
import { TChannelProps } from '../../utils/chat/type';

type TChannelListItemProps = {
  channel: TChannelProps;
};

const ChannelListItem = ({ channel }: TChannelListItemProps) => {
  const { channelName } = channel;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 2,
        borderRadius: '16px',
        border: '1px solid',
        width: 'fit-content',
      }}
    >
      {/* <Avatar
        src={channel.thumbnail}
        sx={{ width: '50px', height: '50px', borderRadius: '10px' }}
      /> */}
      <Box>
        <h3>{channelName}</h3>
      </Box>
    </Box>
  );
};

export default ChannelListItem;
