import { Box, Sheet, Stack, Typography } from '@mui/joy';
import { useMutation } from 'react-query';
import { AiSummaryQuery } from '../../api/ai/query';
import { useChatStore } from '../../state/chat';
import AiInit from './AiInit';
import AiLoading from './AiLoading';
import { useEffect } from 'react';
import AiResult from './AiResult';
import { useParams } from 'react-router-dom';
import { useAIStore } from '../../state/ai';
import { useUIStore } from '@/state/ui';
import ToggleAiPannelButton from '../common/header/ToggleAiPannelButton';

export default function AiPannel() {
  const { id: chatId } = useParams();

  const { selectedId } = useChatStore();
  const { init: initAIStore, aiResult, setAiResult } = useAIStore();

  const { isAiPannelOpen } = useUIStore();

  const aiSummaryMutation = useMutation({
    ...AiSummaryQuery(),
    onSuccess: res => {
      // console.log(JSON.stringify(res, null, 4));
      setAiResult(res);
    },
    onError: () => {
      alert('AI 요약 중 에러가 발생했습니다.');
    },
  });

  const handleClickAIButton = (howmany: number, startMessageId: string) => {
    const req = {
      channelId: selectedId,
      howmany,
      startMessageId,
    };

    aiSummaryMutation.mutate(req);
  };

  useEffect(() => {
    initAIStore();
  }, [chatId]);

  return (
    <Sheet
      sx={{
        borderLeft: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        position: { xs: 'fixed', sm: 'sticky' },
        transform: {
          xs: isAiPannelOpen ? 'translateX(0)' : 'translateX(100%)',
          sm: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        width: '100%',
        height: '100dvh',
        overflowY: 'auto',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        p={2}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.body',
        }}
      >
        <ToggleAiPannelButton />
        <Typography
          fontSize={{ xs: 'md', md: 'lg' }}
          component="h1"
          fontWeight="lg"
          sx={{ mr: 'auto' }}
        >
          인공지능 비서
        </Typography>
      </Stack>
      <Box
        sx={{
          flex: 1,
          height: 'max-content',
        }}
      >
        {aiSummaryMutation.isLoading ? (
          <AiLoading />
        ) : aiSummaryMutation.isSuccess && Object.keys(aiResult).length > 0 ? (
          <AiResult />
        ) : (
          <AiInit handleClickAIButton={handleClickAIButton} />
        )}
      </Box>
    </Sheet>
  );
}
