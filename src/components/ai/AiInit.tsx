import {
  Box,
  Button,
  Stack,
  Step,
  StepIndicator,
  Stepper,
  Typography,
} from '@mui/joy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useMemo } from 'react';
import { useAIStore } from '@/state/ai';
import { Check } from '@mui/icons-material';

interface IAiInitProps {
  handleClickAIButton: (howmany: number, startMessageId: string) => void;
}

const AiInit = ({ handleClickAIButton }: IAiInitProps) => {
  const {
    isSelectingMessages,
    setIsSelectingMessages,
    selectedMessages,
    setSelectedMessages,
    howmany,
  } = useAIStore();

  const isSelectingEnded = useMemo(() => {
    return selectedMessages.start && selectedMessages.end;
  }, [selectedMessages]);

  const aiButtonHandler = () => {
    if (!selectedMessages.start || !selectedMessages.start._id) return;
    setIsSelectingMessages(false);
    handleClickAIButton(howmany, selectedMessages.start._id);
  };

  const activeStep = useMemo(() => {
    if (selectedMessages.start && selectedMessages.end) return 2;
    if (selectedMessages.start) return 1;
    return 0;
  }, [selectedMessages]);

  const steps = ['시작 메시지 선택', '끝 메시지 선택'];

  const handleCancel = () => {
    setIsSelectingMessages(false);
    setSelectedMessages({
      start: null,
      end: null,
    });
  };

  return (
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

      {/* <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Typography mr={1}>요약할 최신 메세지 수:</Typography>
        <Input
          defaultValue={100}
          size="sm"
          type="number"
          autoFocus={true}
          slotProps={{
            input: {
              ref: howmanyInputRef,
              min: 1,
              max: 200,
            },
          }}
          sx={{
            width: 'fit-content',
          }}
        />
      </Stack> */}

      <Stepper
        sx={{
          width: '100%',
          marginTop: 3,
          marginBottom: 3,
          display: !isSelectingMessages ? 'none' : 'flex',
        }}
        size="sm"
      >
        {steps.map((step, index) => (
          <Step
            orientation="vertical"
            key={index}
            indicator={
              <StepIndicator
                variant={activeStep <= index ? 'soft' : 'solid'}
                color={activeStep < index ? 'neutral' : 'primary'}
              >
                {activeStep <= index ? index + 1 : <Check />}
              </StepIndicator>
            }
          >
            {step}
          </Step>
        ))}
      </Stepper>

      <Button
        size="sm"
        color="primary"
        sx={{
          display: isSelectingMessages ? 'none' : 'flex',
          my: 3,
          alignSelf: 'center',
          borderRadius: 'sm',
        }}
        endDecorator={<AutoAwesomeIcon />}
        onClick={() => setIsSelectingMessages(true)}
      >
        요약할 메시지 선택
      </Button>
      <Stack direction="row" spacing={2}>
        <Button
          size="sm"
          color="primary"
          sx={{
            display: isSelectingMessages ? 'flex' : 'none',
            my: 3,
            alignSelf: 'center',
            borderRadius: 'sm',
          }}
          disabled={!isSelectingEnded}
          endDecorator={<AutoAwesomeIcon />}
          onClick={aiButtonHandler}
        >
          주제 요약하기
        </Button>
        <Button
          size="sm"
          color="primary"
          variant="outlined"
          sx={{
            display: isSelectingMessages ? 'flex' : 'none',
            my: 3,
            alignSelf: 'center',
            borderRadius: 'sm',
          }}
          onClick={handleCancel}
        >
          취소
        </Button>
      </Stack>
    </Box>
  );
};

export default AiInit;
