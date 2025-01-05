import { Box, Button, Typography } from '@mui/joy';
import { TChannelProps } from '../../utils/chat/type';
import { useUserStore } from '../../state/user';
import { subscribeChannel, unsubscribeChannel } from '../../utils/search/api';
import { useMemo } from 'react';

type TChannelListItemProps = {
  channel: TChannelProps;
};

const ChannelListItem = ({ channel }: TChannelListItemProps) => {
  const { channelName, channelId } = channel;
  const channelDescription = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.`;

  const { subscriptions, setSubscriptions } = useUserStore();
  const isSubscribed = useMemo(
    () => false && subscriptions.includes(channelId),
    [subscriptions, channelId],
  );

  const handleSubscribe = async () => {
    if (isSubscribed) {
      unsubscribeChannel(channelId);
    } else {
      const { user } = await subscribeChannel(channelId);
      const { subscriptions } = user;

      setSubscriptions(subscriptions);
    }
  };

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
        width: 'fit-content',
        maxWidth: '300px',
        height: 'fit-content',
        alignSelf: 'flex-start',
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: 1 }}>
          <Typography level="h4">
            <b>{channelName}</b>
          </Typography>
          <Button
            size="sm"
            sx={{
              fontSize: '12px',
              marginLeft: 'auto',
              marginRight: 0,
            }}
            variant="soft"
            color={isSubscribed ? 'danger' : 'primary'}
            onClick={handleSubscribe}
          >
            {isSubscribed ? '구독중' : '참여'}
          </Button>
        </Box>

        <Typography level="body-sm">{channelDescription}</Typography>
      </Box>
    </Box>
  );
};

export default ChannelListItem;
