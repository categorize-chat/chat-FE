import { Box, Typography } from '@mui/joy';
import SubsButton from './SubsButton';
import { TChannelProps } from '@/types';
type TChannelListItemProps = {
  channel: TChannelProps;
};

const ChannelListItem = ({ channel }: TChannelListItemProps) => {
  const { channelName, channelId, _id: channelIdSub, description } = channel;
  const channelDescription = description || '설명이 없습니다.';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: 1,
        margin: 1,
        borderRadius: '8px',
        border: '1px solid #ccc',
        width: '300px',
        height: '120px',
        alignSelf: 'flex-start',
        overflow: 'hidden',
      }}
    >
      <Box
        width="100%"
        height="100%"
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 1 }}>
          <Typography level="h4">
            <b>{channelName}</b>
          </Typography>
          <SubsButton channelId={channelId || channelIdSub!} />
        </Box>

        <Typography
          level="body-sm"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {channelDescription}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChannelListItem;
