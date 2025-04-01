import { Box, Modal } from '@mui/joy';

type TModalBaseProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

const modalBackgroundStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'neutral.softBg',
  boxShadow: 24,
  borderRadius: 16,
  p: 4,
  display: `flex`,
  flexDirection: `column`,
  gap: `1rem`,
};

const ModalBase = ({ open, setOpen, children }: TModalBaseProps) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box
        sx={modalBackgroundStyle}
        boxShadow={3}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default ModalBase;
