import { Box, Button, Card, Divider, Stack, Typography } from '@mui/joy';
import { TAiSummaryResponse } from '../../utils/ai/type';
import { TColorMaps, useAIStore } from '../../state/ai';
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { useChatStore } from '../../state/chat';
import { TMessageProps } from '../../utils/chat/type';
import _ from 'lodash';
import { Circle } from '@mui/icons-material';
import RestoreIcon from '@mui/icons-material/Restore';

interface IAiResultProps {
  result: TAiSummaryResponse['result'];
  setResult: Dispatch<SetStateAction<TAiSummaryResponse['result'] | null>>;
}

const AiResult = ({ result, setResult }: IAiResultProps) => {
  const { messages, summary } = result;

  const { chatMessages, setChatMessages } = useChatStore();
  const { setColorMaps, setFirstTopicIndex } = useAIStore();

  const replaceMessage = (
    refernece: TMessageProps[],
    replacer: TMessageProps[],
  ): [TMessageProps[], number] => {
    const comparer = replacer[0];

    if (refernece.length <= replacer.length) {
      return [replacer, 0];
    }

    // 위로 올라가면서 같은 채팅 찾기
    for (let i = refernece.length - replacer.length; i > 0; i--) {
      const target = refernece[i];

      console.log(target, comparer);

      const targetTime = new Date(target.createdAt);
      const comparerTime = new Date(comparer.createdAt);

      if (
        target.content === comparer.content &&
        targetTime.getTime() === comparerTime.getTime() &&
        target.nickname === comparer.nickname
      ) {
        const result = [
          ...refernece.slice(0, i),
          ...replacer,
          ...refernece.slice(i + replacer.length),
        ];

        return [result, i];
      }
    }

    // 못 찾았을 경우, 그냥 원본 반환
    return [refernece, refernece.length];
  };

  const handleClickReturn = () => {
    if (confirm('결과물을 모두 버리고 처음 화면으로 돌아가시겠습니까?'))
      setResult(null);
  };

  useEffect(() => {
    if (!messages || !summary) return;

    const [replacedMessage, startIndex] = replaceMessage(
      chatMessages,
      messages,
    );

    const topicIndices = Object.keys(summary);
    const firstTopicIndex: {
      [n: number]: number;
    } = {};

    let k = 0;

    for (let i = startIndex; i < replacedMessage.length; i++) {
      if (replacedMessage[i].topic === +topicIndices[k]) {
        firstTopicIndex[+topicIndices[k]] = i;
        k++;
      }
    }

    setChatMessages(replacedMessage);
    setFirstTopicIndex(firstTopicIndex);

    // 사용 가능한 색 지정
    const colorNums = topicIndices.length;
    const step = Math.floor(360 / colorNums);

    const displacement = Math.floor(Math.random() * step);

    const defaultS = 70;
    const defaultL = 80;

    const hs = Array.from(
      { length: colorNums },
      (_, i) => displacement + i * step,
    );

    const colorMaps: TColorMaps = {};

    topicIndices.forEach((topic, i) => {
      colorMaps[+topic] = { h: hs[i], s: defaultS, l: defaultL };
    });

    setColorMaps(colorMaps);
  }, [messages, summary]);

  return (
    <Box
      sx={{
        height: 'calc(100% - 56px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
      }}
    >
      <Stack
        sx={{
          my: 3,
          textAlign: 'center',
          px: 3,
        }}
      >
        <Typography fontSize="lg" fontWeight="lg" sx={{}}>
          찾은 키워드들이에요!
        </Typography>
        <Typography>누르면 해당하는 채팅을 하이라이트 할 수 있어요</Typography>
      </Stack>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          px: 3,
          gap: 2,
          maxHeight: 'calc(100vh - 240px)',
          overflowY: 'auto', // 세로 스크롤 활성화
        }}
      >
        {Object.entries(summary).map(([topicIndex, { keywords, content }]) => (
          <KeywordButton
            topicIndex={+topicIndex}
            keyword={keywords[0]}
            key={topicIndex}
            summary={content}
          />
        ))}
        {Object.entries(summary).map(([topicIndex, { keywords, content }]) => (
          <KeywordButton
            topicIndex={+topicIndex}
            keyword={keywords[0]}
            key={topicIndex}
            summary={content}
          />
        ))}
      </Box>
      <Stack
        sx={{
          my: 3,
        }}
      >
        <Button endDecorator={<RestoreIcon />} onClick={handleClickReturn}>
          뒤로 가기
        </Button>
      </Stack>
    </Box>
  );
};

interface IKeywordButton {
  topicIndex: number;
  keyword: string;
  summary: string;
}

const KeywordButton = ({ topicIndex, keyword, summary }: IKeywordButton) => {
  const { selectedTopic, setSelectedTopic, colorMaps } = useAIStore();

  const buttonColor = useMemo(() => {
    const colorAvailable = colorMaps[topicIndex];

    if (!colorAvailable) {
      return '';
    }

    return `hsl(${colorAvailable.h} ${colorAvailable.s} ${colorAvailable.l})`;
  }, [colorMaps]);

  const cardColor = useMemo(
    () =>
      selectedTopic.index === topicIndex
        ? {
            bgColor: buttonColor,
            circleColor: 'inherit',
          }
        : {
            bgColor: '',
            circleColor: buttonColor,
          },
    [buttonColor, topicIndex, selectedTopic],
  );

  const handleClickKeyword = () => {
    if (selectedTopic.index === topicIndex) {
      setSelectedTopic({
        index: -1,
        color: '',
      });
    } else {
      setSelectedTopic({
        index: topicIndex,
        color: buttonColor,
      });
    }
  };

  return (
    <Card
      variant="soft"
      sx={{
        bgcolor: cardColor.bgColor,
        '&:hover': {
          opacity: 0.9,
          cursor: 'pointer',
        },
        width: '100%',
        transition: 'ease 1s',
      }}
      onClick={handleClickKeyword}
    >
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Typography fontSize="lg" fontWeight="xl">
          {keyword}
        </Typography>
        <Circle
          sx={{
            color: cardColor.circleColor,
            transition: 'ease 1s',
          }}
        />
      </Stack>
      <Divider />
      <Stack sx={{}}>
        <Typography sx={{}}>{summary}</Typography>
      </Stack>
    </Card>
  );
};

export default AiResult;
