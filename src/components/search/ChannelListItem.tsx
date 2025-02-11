import { Box, Typography } from '@mui/joy';
import { TChannelProps } from '../../utils/chat/type';
import SubsButton from './SubsButton';

type TChannelListItemProps = {
  channel: TChannelProps;
};

const ChannelListItem = ({ channel }: TChannelListItemProps) => {
  const { channelName, channelId, _id: channelIdSub, description } = channel;
  const channelDescription = description || '설명이 없습니다.';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: 1,
        margin: 1,
        borderRadius: '8px',
        border: '1px solid #ccc',
        width: '300px',
        height: 'fit-content',
        alignSelf: 'flex-start',
      }}
    >
      <Box width="100%">
        <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 1 }}>
          <Typography level="h4">
            <b>{channelName}</b>
          </Typography>
          <SubsButton channelId={channelId || channelIdSub!} />
        </Box>

        <Typography level="body-sm">{channelDescription}</Typography>
      </Box>
    </Box>
  );
};

export default ChannelListItem;
