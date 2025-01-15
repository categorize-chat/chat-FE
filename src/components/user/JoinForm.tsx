import { QuestionAnswerRounded } from '@mui/icons-material';

interface IJoinFormProps {
  children: React.ReactNode;
}

const JoinForm = ({ children }: IJoinFormProps) => {
  return (
    <div
      style={{
        textAlign: 'center',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '64px',
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
    </div>
  );
};

export default JoinForm;
