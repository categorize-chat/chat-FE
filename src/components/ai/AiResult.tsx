import { Box, Button, Stack, Typography } from '@mui/joy';
import { TAiSummaryResponse } from '../../utils/ai/type';
import { addColor, calculateColor } from '../../utils/common/function';
import { useAIStore } from '../../state/ai';
import { useEffect } from 'react';
import { useChatStore } from '../../state/chat';
import { TMessageProps } from '../../utils/chat/type';
import _ from 'lodash';

interface IAiResultProps {
  result: TAiSummaryResponse['result'];
}

const AiResult = ({ result }: IAiResultProps) => {
  const { messages, summary } = result;

  const { chatMessages, setChatMessages } = useChatStore();

  const replaceMessage = (
    refernece: TMessageProps[],
    replacer: TMessageProps[],
  ) => {
    const comparer = replacer[0];

    if (refernece.length <= replacer.length) {
      return replacer;
    }

    // 위로 올라가면서 같은 채팅 찾기
    for (let i = refernece.length - replacer.length; i > 0; i--) {
      const target = refernece[i];

      // console.log(target, comparer);

      if (
        target.content === comparer.content &&
        target.createdAt === comparer.createdAt &&
        target.nickname === comparer.nickname
      ) {
        const result = [
          ...refernece.slice(0, i),
          ...replacer,
          ...refernece.slice(i + replacer.length),
        ];

        return result;
      }
    }

    // 못 찾았을 경우, 그냥 원본 반환
    return refernece;
  };

  useEffect(() => {
    if (!messages) return;

    setChatMessages(replaceMessage(chatMessages, messages));
  }, [messages]);

  return (
    <Box
      sx={{
        height: 'calc(100% - 56px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
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
        찾은 키워드들이에요
      </Typography>
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexFlow: 'wrap',
          gap: 1,
        }}
      >
        {Object.entries(summary).map(([topicIndex, { keywords }]) => (
          <KeywordButton
            topicIndex={+topicIndex}
            keyword={keywords[0]}
            key={topicIndex}
          />
        ))}
      </Stack>
    </Box>
  );
};

interface IKeywordButton {
  topicIndex: number;
  keyword: string;
}

const KeywordButton = ({ topicIndex, keyword }: IKeywordButton) => {
  const buttonColor = calculateColor(keyword);
  const alphaColor = buttonColor + '44';

  const { setSelectedTopic } = useAIStore();

  const handleClickKeyword = () => {
    setSelectedTopic({
      index: topicIndex,
      color: buttonColor,
    });
  };

  return (
    <Button
      sx={{
        bgcolor: alphaColor,
        '&:hover': {
          bgcolor: buttonColor,
        },
        px: 3,
      }}
      onClick={handleClickKeyword}
    >
      <Typography
        sx={{
          color: 'black',
        }}
      >
        {keyword}
      </Typography>
    </Button>
  );
};

export default AiResult;
