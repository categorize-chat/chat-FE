import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { Box, Chip, IconButton, Input } from '@mui/joy';
import List from '@mui/joy/List';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChatListItem from './ChatListItem';
import { useChatStore } from '../../state/chat';
import { toggleMessagesPane } from '../../utils/chat';
import { useMutation } from 'react-query';
import { chatRoomGenerateQuery } from '../../utils/chat/query';

export default function ChatsPane() {
  const { chats, addChat } = useChatStore();
  const chatRoomGenerateMutation = useMutation({
    ...chatRoomGenerateQuery(),
    onSuccess: ({ channelId, channelName }) => {
      addChat({ channelId, channelName });
    },
  });

  const handleNewChat = () => {
    // TODO: change with modal's value
    chatRoomGenerateMutation.mutate({
      channelName: 'temp',
    });
  };

  return (
    <Sheet
      sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        height: 'calc(100dvh - var(--Header-height))',
        overflowY: 'auto',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        p={2}
        pb={1.5}
      >
        <Typography
          fontSize={{ xs: 'md', md: 'lg' }}
          component="h1"
          fontWeight="lg"
          endDecorator={
            <Chip
              variant="soft"
              color="primary"
              size="md"
              slotProps={{ root: { component: 'span' } }}
            >
              {chats.length}
            </Chip>
          }
          sx={{ mr: 'auto' }}
        >
          메세지
        </Typography>
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          onClick={handleNewChat}
          sx={{ display: { xs: 'none', sm: 'unset' } }}
        >
          <AddCommentIcon />
        </IconButton>
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          onClick={() => {
            toggleMessagesPane();
          }}
          sx={{ display: { sm: 'none' } }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Input
          size="sm"
          startDecorator={<SearchRoundedIcon />}
          placeholder="Search"
          aria-label="Search"
        />
      </Box>
      <List
        sx={{
          py: 0,
          '--ListItem-paddingY': '0.75rem',
          '--ListItem-paddingX': '1rem',
        }}
      >
        {chats.map((chat) => (
          <ChatListItem key={chat.channelId} {...chat} />
        ))}
      </List>
    </Sheet>
  );
}
