import { useMemo, useState } from 'react';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { TMessageProps } from '../../utils/chat/type';
import { useAIStore } from '../../state/ai';

type ChatBubbleProps = TMessageProps & {
  variant: 'sent' | 'received';
  date: string;
  time: string;
};

export default function ChatBubble({
  content,
  variant,
  time,
  nickname,
  topic,
}: ChatBubbleProps) {
  const isSent = variant === 'sent';
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isCelebrated, setIsCelebrated] = useState<boolean>(false);

  const { selectedTopic } = useAIStore();

  const bubbleColor = useMemo(() => {
    const { index, color } = selectedTopic;

    if (index === -1 || index !== topic) {
      return isSent ? 'var(--joy-palette-primary-solidBg)' : 'background.body';
    }

    return color;
  }, [selectedTopic, topic, isSent]);

  const isDim = useMemo(() => {
    const { index } = selectedTopic;

    return index !== -1 && index !== topic;
  }, [selectedTopic, topic, isSent]);

  return (
    <Box
      sx={{
        maxWidth: '60%',
        minWidth: 'auto',
        marginRight: `1rem !important`,
        opacity: isDim ? 0.5 : 1,
        transition: 'ease 1s',
      }}
      className="asdf"
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 0.25 }}
      >
        <Typography level="body-xs">{nickname}</Typography>
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
          sx={{
            p: 1.25,
            borderRadius: 'lg',
            borderTopRightRadius: isSent ? 0 : 'lg',
            borderTopLeftRadius: isSent ? 'lg' : 0,
            backgroundColor: bubbleColor,
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
