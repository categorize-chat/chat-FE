import { Box, CircularProgress, Typography, Stack } from '@mui/joy';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const AiLoading = () => {
  return (
    <Box
      sx={{
        height: 'calc(100% - 56px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        p: 3,
      }}
    >
      <SmartToyIcon
        sx={{ fontSize: 50, color: 'primary.main', marginBottom: '1rem' }}
      />
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Typography fontSize="lg" fontWeight="lg">
          AI가 열심히 채팅을 분석하고 있습니다
        </Typography>
      </Stack>
      <Typography>메시지를 읽고 요약을 준비하고 있어요!</Typography>
      <Typography
        fontSize="sm"
        sx={{
          opacity: 0.5,
        }}
      >
        (최대 30초~1분 가량 소요될 수 있어요)
      </Typography>
      <CircularProgress sx={{ my: 3 }} />
    </Box>
  );
};

export default AiLoading;
