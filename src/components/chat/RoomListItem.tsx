import { Fragment } from 'react';
import Box from '@mui/joy/Box';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import AvatarWithStatus from '../common/AvatarWithStatus';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/state/chat';
import { TChannelProps } from '@/types';
import { Paths } from '@/routes/paths';
import { Chip } from '@mui/joy';
import { useUIStore } from '@/state/ui';

type TRoomListItemProps = TChannelProps;

export default function RoomListItem(props: TRoomListItemProps) {
  const { toggleMessagesPane } = useUIStore();

  const { channelId, channelName, unreadCount, lastMessage } = props;
  const navigate = useNavigate();

  const selectedId = useChatStore(state => state.selectedId);
  const selected = selectedId === channelId;

  const chatListClick = (roomId: string) => {
    navigate(`${Paths.chat.base()}/${roomId}`);
  };

  const lastMessageContent = lastMessage
    ? `${lastMessage.user.nickname}: ${lastMessage.content}`
    : `${channelName} 톡방입니다`;

  return (
    <Fragment>
      <ListItem>
        <ListItemButton
          onClick={() => {
            toggleMessagesPane();
            chatListClick(channelId);
          }}
          selected={selected}
          color="neutral"
          sx={{
            flexDirection: 'column',
            alignItems: 'initial',
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1.5}>
            <AvatarWithStatus />
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">{channelName}</Typography>
            </Box>
            <Box
              sx={{
                lineHeight: 1.5,
                textAlign: 'right',
              }}
            >
              {unreadCount > 0 && (
                <Chip color="primary" size="sm">
                  {unreadCount}
                </Chip>
              )}
            </Box>
          </Stack>
          <Typography
            level="body-sm"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {lastMessageContent}
          </Typography>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </Fragment>
  );
}
