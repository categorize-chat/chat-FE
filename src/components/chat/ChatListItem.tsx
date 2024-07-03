import { useCallback, Fragment } from 'react';
import Box from '@mui/joy/Box';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import AvatarWithStatus from '../common/AvatarWithStatus';
import { useNavigate } from 'react-router-dom';
import { toggleMessagesPane } from '../../utils/chat';
import { useChatStore, useSocket } from '../../state/chat';
import { TUserProps } from '../../utils/user/type';
import { TChatProps, TMessageProps } from '../../utils/chat/type';
import { Paths } from '../../utils/constant';

type ChatListItemProps = TChatProps & {
  unread?: boolean;
};

export default function ChatListItem(props: ChatListItemProps) {
  const { channelId, channelName, unread } = props;
  const socket = useSocket((state) => state.socket);
  const navigate = useNavigate();

  const selectedId = useChatStore((state) => state.selectedId);
  const selected = selectedId === channelId;

  const chatListClick = useCallback(
    (id: string) => {
      navigate(`${Paths.chat.base()}/${id}`);

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
              <Typography level="body-sm">{'test'}</Typography>
            </Box>
            <Box
              sx={{
                lineHeight: 1.5,
                textAlign: 'right',
              }}
            >
              {unread && <CircleIcon sx={{ fontSize: 12 }} color="primary" />}
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
            {'hello!'}
          </Typography>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </Fragment>
  );
}
