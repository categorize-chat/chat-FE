import { useCallback, Fragment } from 'react';
import Box from '@mui/joy/Box';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import AvatarWithStatus from '../common/AvatarWithStatus';
import { MessageProps, UserProps } from '../types';
import { toggleMessagesPane } from '../utils';
import { useChatStore, useSocket } from '../state/chat';
import { useNavigate } from 'react-router-dom';

type ChatListItemProps = {
  id: string;
  unread?: boolean;
  sender: UserProps;
  messages: MessageProps[];
};

export default function ChatListItem(props: ChatListItemProps) {
  const { id, sender, messages } = props;
  const socket = useSocket((state) => state.socket);
  const navigate = useNavigate();

  const selectedId = useChatStore((state) => state.selectedId);
  const selected = selectedId === id;

  const chatListClick = useCallback(
    (id: string) => {
      navigate(`/chat/${id}`);

      if (socket === undefined) {
        return;
      }

      socket.emit('join_room', id);
    },
    [navigate, socket],
  );

  return (
    <Fragment>
      <ListItem>
        <ListItemButton
          onClick={() => {
            toggleMessagesPane();
            chatListClick(id);
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
            <AvatarWithStatus online={sender.online} src={sender.avatar} />
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">{sender.name}</Typography>
              <Typography level="body-sm">{sender.username}</Typography>
            </Box>
            <Box
              sx={{
                lineHeight: 1.5,
                textAlign: 'right',
              }}
            >
              {messages[0].unread && (
                <CircleIcon sx={{ fontSize: 12 }} color="primary" />
              )}
              <Typography
                level="body-xs"
                display={{ xs: 'none', md: 'block' }}
                noWrap
              >
                5 mins ago
              </Typography>
            </Box>
          </Stack>
          <Typography
            level="body-sm"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {messages[0].content}
          </Typography>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </Fragment>
  );
}
