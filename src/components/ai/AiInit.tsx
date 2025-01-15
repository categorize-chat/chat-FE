import { Box, Button, Input, Stack, Typography } from '@mui/joy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useRef } from 'react';

interface IAiInitProps {
  handleClickAIButton: (howmany: number) => void;
}

const AiInit = ({ handleClickAIButton }: IAiInitProps) => {
  const howmanyInputRef = useRef<HTMLInputElement | null>(null);

  const aiButtonHandler = () => {
    if (!howmanyInputRef || !howmanyInputRef.current) return;

    const howmany = +(howmanyInputRef.current as HTMLInputElement).value || 100;
    handleClickAIButton(howmany);
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

      <Stack
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
      </Stack>

      <Button
        size="sm"
        color="primary"
        sx={{ my: 3, alignSelf: 'center', borderRadius: 'sm' }}
        endDecorator={<AutoAwesomeIcon />}
        onClick={aiButtonHandler}
      >
        주제 요약하기
      </Button>
    </Box>
  );
};

export default AiInit;
