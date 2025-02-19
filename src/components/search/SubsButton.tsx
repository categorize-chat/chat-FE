import { Button } from '@mui/joy';
import { useUserStore } from '../../state/user';
import { useMemo, useState } from 'react';
import { searchApi } from '../../utils/search/api';

type TSubsButtonProps = {
  channelId: string;
  callbackFn?: () => void;
};

const SubsButton = ({ channelId, callbackFn }: TSubsButtonProps) => {
  const { subscriptions, setSubscriptions } = useUserStore();
  const [isHovered, setIsHovered] = useState(false);

  const isSubscribed = useMemo(() => {
    const realChannelId = channelId;

    return subscriptions.includes(realChannelId);
  }, [subscriptions, channelId]);

  const buttonText = useMemo(() => {
    if (isHovered) {
      return isSubscribed ? '구독취소' : '참여';
    }

    return isSubscribed ? '구독중' : '참여';
  }, [isHovered, isSubscribed]);

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
      ref={ref => {
        if (ref) {
          ref.onmouseenter = () => {
            setIsHovered(true);
          };
          ref.onmouseleave = () => {
            setIsHovered(false);
          };
        }
      }}
    >
      {buttonText}
    </Button>
  );
};

export default SubsButton;
