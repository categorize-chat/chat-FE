import { Sheet, Stack, Typography } from '@mui/joy';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useMutation } from 'react-query';
import { AiSummaryQuery } from '../../utils/ai/query';
import { useChatStore } from '../../state/chat';
import AiInit from '../ai/AiInit';
import AiLoading from '../ai/AiLoading';
import { useState } from 'react';
import { TAiSummaryResponse } from '../../utils/ai/type';
import AiResult from '../ai/AiResult';

export default function AiPannel() {
  const { selectedId } = useChatStore();

  const [aiResult, setAiResult] = useState<TAiSummaryResponse['result']>();

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
      {aiSummaryMutation.isLoading ? (
        <AiLoading />
      ) : aiSummaryMutation.isSuccess && aiResult ? (
        <AiResult result={aiResult} />
      ) : (
        <AiInit handleClickAIButton={handleClickAIButton} />
      )}
    </Sheet>
  );
}
