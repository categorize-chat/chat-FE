import { useMemo, useState } from 'react';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { TMessageProps } from '@/types';
import { useAIStore } from '@/state/ai';

type TMessageBubbleProps = {
  variant: 'sent' | 'received';
  date: string;
  time: string;
  message: TMessageProps;
  disabled?: boolean;
};

export default function MessageBubble({
  variant,
  time,
  message,
  disabled,
}: TMessageBubbleProps) {
  const { user, content, topic } = message;
  const isSent = variant === 'sent';
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isCelebrated, setIsCelebrated] = useState<boolean>(false);

  const {
    selectedTopic,
    colorMaps,
    hml,
    setSelectedTopic,
    isSelectingMessages,
    selectedMessages,
    setSelectedMessages,
  } = useAIStore();

  const isSelected = useMemo(() => {
    if (selectedMessages.start && selectedMessages.end) {
      return (
        Date.parse(message.createdAt) >=
          Date.parse(selectedMessages.start.createdAt) &&
        Date.parse(message.createdAt) <=
          Date.parse(selectedMessages.end.createdAt)
      );
    }
    if (selectedMessages.start) {
      return message._id === selectedMessages.start._id;
    }
    return false;
  }, [selectedMessages, message]);

  const bubbleColor = useMemo(() => {
    if (isSelectingMessages) {
      if (isSelected) {
        return 'var(--joy-palette-primary-300)';
      }
      return isSent ? 'var(--joy-palette-primary-solidBg)' : 'background.body';
    }

    const { index, color } = selectedTopic;

    if (index === -1 || index !== topic) {
      return isSent ? 'var(--joy-palette-primary-solidBg)' : 'background.body';
    }

    return color;
  }, [selectedTopic, topic, isSent, isSelectingMessages, selectedMessages]);

  const isDim = useMemo(() => {
    const { index } = selectedTopic;

    return index !== -1 && index !== topic;
  }, [selectedTopic, topic, isSent]);

  const chatClickHandler = () => {
    if (isSelectingMessages) {
      if (selectedMessages.start) {
        setSelectedMessages({
          ...selectedMessages,
          end: message,
        });
      } else {
        setSelectedMessages({
          start: message,
          end: null,
        });
      }

      return;
    }

    if (topic === -1) return;
    if (!colorMaps || !colorMaps[hml]) return;

    if (topic === selectedTopic.index) {
      setSelectedTopic({
        index: -1,
        color: '',
      });
      return;
    }

    const colorCode = colorMaps[hml][topic];
    if (!colorCode) return;

    const { h, s, l } = colorCode;
    const color = `hsl(${h} ${s} ${l})`;

    setSelectedTopic({
      index: topic,
      color,
    });
  };

  return (
    <Box
      sx={{
        maxWidth: '60%',
        minWidth: 'auto',
        marginRight: `1rem !important`,
        opacity: isDim || (isSelectingMessages && !isSelected) ? 0.5 : 1,
        transition: 'ease 1s',
      }}
      className="asdf"
    >
      <Stack
        direction="row"
        justifyContent={isSent ? 'flex-end' : 'flex-start'}
        spacing={2}
        sx={{ mb: 0.25 }}
      >
        <Typography level="body-xs">{user.nickname}</Typography>
        <Typography level="body-xs">{time.slice(0, -3)}</Typography>
      </Stack>
      <Box
        sx={{ position: 'relative' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sheet
          color={isSent ? 'primary' : 'neutral'}
          variant={isSent ? 'solid' : 'soft'}
          onClick={disabled ? undefined : chatClickHandler}
          sx={{
            p: 1.25,
            borderRadius: 'lg',
            borderTopRightRadius: isSent ? 0 : 'lg',
            borderTopLeftRadius: isSent ? 'lg' : 0,
            backgroundColor: bubbleColor,
            cursor: disabled
              ? 'not-allowed'
              : isSelectingMessages || topic !== -1
                ? 'pointer'
                : '',
            wordBreak: 'keep-all',
            wordWrap: 'break-word',
          }}
        >
          <Typography
            level={'body-sm'}
            sx={{
              color: isSent
                ? 'var(--joy-palette-common-white)'
                : 'var(--joy-palette-text-primary)',
            }}
          >
            {content}
          </Typography>
        </Sheet>
        {(isHovered || isLiked || isCelebrated) && (
          <Stack
            direction="row"
            justifyContent={isSent ? 'flex-end' : 'flex-start'}
            spacing={0.5}
            sx={{
              position: 'absolute',
              top: '50%',
              p: 1.5,
              ...(isSent
                ? {
                    left: 0,
                    transform: 'translate(-100%, -50%)',
                  }
                : {
                    right: 0,
                    transform: 'translate(100%, -50%)',
                  }),
            }}
          >
            <IconButton
              variant={isLiked ? 'soft' : 'plain'}
              color={isLiked ? 'danger' : 'neutral'}
              size="sm"
              onClick={() => setIsLiked(prevState => !prevState)}
            >
              {isLiked ? '❤️' : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton
              variant={isCelebrated ? 'soft' : 'plain'}
              color={isCelebrated ? 'warning' : 'neutral'}
              size="sm"
              onClick={() => setIsCelebrated(prevState => !prevState)}
            >
              {isCelebrated ? '🎉' : <CelebrationOutlinedIcon />}
            </IconButton>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
