import { Button } from '@mui/joy';
import { useUserStore } from '../../state/user';
import { useMemo } from 'react';
import { searchApi } from '../../utils/search/api';

type TSubsButtonProps = {
  channelId: string;
  callbackFn?: () => void;
};

const SubsButton = ({ channelId, callbackFn }: TSubsButtonProps) => {
  const { subscriptions, setSubscriptions } = useUserStore();
  const isSubscribed = useMemo(() => {
    const realChannelId = channelId;

    return subscriptions.includes(realChannelId);
  }, [subscriptions, channelId]);

  const handleSubscribe = async () => {
    const handler = isSubscribed
      ? searchApi.unsubscribeChannel
      : searchApi.subscribeChannel;

    const { user } = await handler(channelId);
    const { subscriptions } = user;

    setSubscriptions(subscriptions);

    callbackFn?.();
  };

  return (
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
  );
};

export default SubsButton;
