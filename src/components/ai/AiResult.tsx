import {
  Box,
  Button,
  Card,
  Divider,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/joy';
import { TAIStore, TColorMaps, useAIStore } from '../../state/ai';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useChatStore } from '../../state/chat';
import { TMessageProps } from '../../utils/chat/type';
import _ from 'lodash';
import { Circle } from '@mui/icons-material';
import RestoreIcon from '@mui/icons-material/Restore';
import { THmlKey } from '../../utils/ai/type';

const AiResult = () => {
  const { aiResult, init } = useAIStore();
  const { summaries } = aiResult;

  const { chatMessages, setChatMessages } = useChatStore();
  const {
    setColorMaps,
    setFirstTopicIndices,
    setSelectedTopic,
    hml,
    setHml,
    replacedPartMessages,
    setReplacedPartMessages,
  } = useAIStore();

  const [startIndex, setStartIndex] = useState(-1);

  const warningText = {
    low: '* 주제간의 충돌이 발생할 수 있습니다.',
    mid: '* 분류가 마음에 들지 않으면 정도를 바꿔보세요.',
    high: '* 제대로 분류되지 않은 채팅이 있을 수 있습니다.',
  } as const;

  const findStartIndex = (
    reference: TMessageProps[],
    comparer: TMessageProps,
    topics: number[],
  ) => {
    // 위로 올라가면서 같은 채팅 찾기
    let i = -1;
    for (i = reference.length - topics.length; i >= 0; i--) {
      const target = reference[i];

      const targetTime = new Date(target.createdAt);
      const comparerTime = new Date(comparer.createdAt);

      if (
        target.content === comparer.content &&
        targetTime.getTime() === comparerTime.getTime() &&
        target.nickname === comparer.nickname
      ) {
        break;
      }
    }

    return i;
  };

  const getReplacedMessage = (
    refernece: TMessageProps[],
    startIndex: number,
    topics: number[],
  ) => {
    return refernece
      .slice(startIndex, startIndex + topics.length)
      .map(({ topic, ...rest }, idx) => ({
        ...rest,
        topic: topics[idx],
      }));
  };

  const handleClickReturn = () => {
    if (confirm('결과물을 모두 버리고 처음 화면으로 돌아가시겠습니까?')) init();
  };

  useEffect(() => {
    if (!aiResult || !chatMessages) return;

    const { topics, summaries, refChat } = aiResult;

    if (!topics || !summaries || !refChat) return;

    const startIndex = findStartIndex(chatMessages, refChat, topics.mid);

    const hmlKey = ['high', 'mid', 'low'] as const;

    const replacedPartMessages = Object.fromEntries(
      hmlKey.map(hml => [
        hml,
        getReplacedMessage(chatMessages, startIndex, topics[hml]),
      ]),
    ) as TAIStore['replacedPartMessages'];

    const firstTopicIndices = Object.fromEntries(
      hmlKey.map(hml => {
        const topicIndex = Object.keys(summaries[hml]);

        const firstTopicIndex: {
          [n: number]: number;
        } = {};

        // 각 토픽 별 첫 인덱스 찾기
        let k = 0;

        for (let i = 0; i < replacedPartMessages[hml].length; i++) {
          if (replacedPartMessages[hml][i].topic === +topicIndex[k]) {
            firstTopicIndex[+topicIndex[k]] = i + startIndex;
            k++;
          }
        }

        return [hml, firstTopicIndex];
      }),
    ) as TAIStore['firstTopicIndices'];

    setStartIndex(startIndex);
    setReplacedPartMessages(replacedPartMessages);
    setFirstTopicIndices(firstTopicIndices);

    // 사용 가능한 색 지정
    const colorMaps = Object.fromEntries(
      hmlKey.map(hml => {
        const topicIndex = Object.keys(summaries[hml]);

        const colorNums = topicIndex.length;
        const step = Math.floor(360 / colorNums);

        const displacement = Math.floor(Math.random() * step);

        const defaultS = 70;
        const defaultL = 80;

        const hs = Array.from(
          { length: colorNums },
          (_, i) => displacement + i * step,
        );

        const color: TColorMaps['high'] = {};

        topicIndex.forEach((topic, i) => {
          color[+topic] = { h: hs[i], s: defaultS, l: defaultL };
        });

        return [hml, color];
      }),
    ) as TAIStore['colorMaps'];

    setColorMaps(colorMaps);
  }, [aiResult]);

  useEffect(() => {
    // 채팅 메세지 설정

    if (
      !chatMessages ||
      !replacedPartMessages ||
      !replacedPartMessages[hml] ||
      startIndex === -1
    )
      return;

    const newChatMessages = [
      ...chatMessages.slice(0, startIndex),
      ...replacedPartMessages[hml],
      ...chatMessages.slice(startIndex + replacedPartMessages[hml].length),
    ];

    setChatMessages(newChatMessages);
  }, [hml, replacedPartMessages, startIndex]);

  useEffect(() => {
    // 토픽 선택 해제

    setSelectedTopic({
      index: -1,
      color: '',
    });
  }, [hml]);

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
      <Stack
        sx={{
          px: 3,
          mb: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <RadioGroup
          orientation="horizontal"
          aria-labelledby="segmented-controls-example"
          name="hml"
          value={hml}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setHml(event.target.value as THmlKey)
          }
          sx={{
            minHeight: 48,
            width: '100%',
            padding: '4px',
            borderRadius: '12px',
            bgcolor: 'neutral.softBg',
            '--RadioGroup-gap': '4px',
            '--Radio-actionRadius': '8px',
          }}
        >
          {[
            ['넓은 분류', 'low'],
            ['적당한 분류', 'mid'],
            ['세밀한 분류', 'high'],
          ].map(([name, value]) => (
            <Radio
              key={value}
              color="neutral"
              value={value}
              disableIcon
              label={name}
              variant="plain"
              sx={{ px: 2, alignItems: 'center' }}
              slotProps={{
                action: ({ checked }) => ({
                  sx: {
                    ...(checked && {
                      bgcolor: 'background.surface',
                      boxShadow: 'sm',
                      '&:hover': {
                        bgcolor: 'background.surface',
                      },
                      fontWeight: 'bold',
                    }),
                  },
                }),
              }}
            />
          ))}
        </RadioGroup>
        <Typography
          sx={{
            color: 'var(--joy-palette-text-tertiary)',
          }}
        >
          {warningText[hml]}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          px: 3,
          gap: 2,
          maxHeight: 'calc(100vh - 344px)',
          overflowY: 'auto', // 세로 스크롤 활성화
        }}
      >
        {summaries &&
          summaries[hml] &&
          Object.entries(summaries[hml]).map(
            ([topicIndex, { keywords, content }]) => (
              <KeywordButton
                topicIndex={+topicIndex}
                keyword={keywords[0]}
                key={topicIndex}
                summary={content}
              />
            ),
          )}
      </Box>
      <Stack
        sx={{
          mt: 'auto',
        }}
      >
        <Button
          sx={{
            my: 3,
          }}
          endDecorator={<RestoreIcon />}
          onClick={handleClickReturn}
        >
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
  const { selectedTopic, setSelectedTopic, colorMaps, hml } = useAIStore();

  const buttonColor = useMemo(() => {
    if (!colorMaps || !colorMaps[hml]) return '';

    const colorAvailable = colorMaps[hml][topicIndex];

    if (!colorAvailable) {
      return '';
    }

    return `hsl(${colorAvailable.h} ${colorAvailable.s} ${colorAvailable.l})`;
  }, [colorMaps, hml]);

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
