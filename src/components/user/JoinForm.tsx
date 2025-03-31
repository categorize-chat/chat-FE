import { QuestionAnswerRounded } from '@mui/icons-material';
import { Box } from '@mui/joy';

interface IJoinFormProps {
  children: React.ReactNode;
}

const JoinForm = ({ children }: IJoinFormProps) => {
  return (
    <Box
      p={2}
      sx={{
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
        backgroundColor: '#eaf2f7',
        borderRadius: '16px',
      }}
    >
      <QuestionAnswerRounded
        sx={{
          margin: '0 auto',
          fontSize: '50px',
        }}
        color="primary"
      />
      {children}
    </Box>
  );
};

export default JoinForm;
