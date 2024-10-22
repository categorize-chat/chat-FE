import { Box, Button, Sheet, Stack, Typography } from '@mui/joy';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useMutation, useQuery } from 'react-query';
import { AiSummaryQuery } from '../../utils/ai/query';
import { useChatStore } from '../../state/chat';

export default function AiPannel() {
  const { selectedId } = useChatStore();

  const aiSummaryMutation = useMutation({
    ...AiSummaryQuery(),
    onSuccess: ({ messages, summary }) => {
      console.log(messages, summary);
    },
    onError: () => {
      alert('AI 요약 중 에러가 발생했습니다.');
    },
  });

  const handleClickAIButton = () => {
    const req = {
      channelId: selectedId,
    };

    aiSummaryMutation.mutate(req);
  };

  return (
    <Sheet
      sx={{
        borderLeft: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        p={2}
        pb={1.5}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.body',
        }}
      >
        <Typography
          fontSize={{ xs: 'md', md: 'lg' }}
          component="h1"
          fontWeight="lg"
          sx={{ mr: 'auto' }}
          startDecorator={<SmartToyIcon />}
        >
          인공지능 비서
        </Typography>
      </Stack>
      <Box
        sx={{
          height: 'calc(100% - 56px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: 3,
        }}
      >
        <Typography
          fontSize="lg"
          fontWeight="lg"
          sx={{
            py: 3,
          }}
        >
          주제 찾기를 시작해 보세요!
        </Typography>
        <ul
          style={{
            color: 'gray',
            listStylePosition: 'outside',
            paddingLeft: 0,
          }}
        >
          <li>지금 무슨 주제가 오갈까?</li>
          <li>각 주제에 해당하는 채팅들은?</li>
          <li>누가 제일 많이 말하고 있을까?</li>
          <li>채팅을 요약하고 싶어...</li>
        </ul>

        <Button
          size="sm"
          color="primary"
          sx={{ my: 3, alignSelf: 'center', borderRadius: 'sm' }}
          endDecorator={<AutoAwesomeIcon />}
          onClick={handleClickAIButton}
        >
          주제 요약하기
        </Button>
      </Box>
    </Sheet>
  );
}
