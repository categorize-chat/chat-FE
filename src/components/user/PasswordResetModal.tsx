import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
} from '@mui/joy';
import { useState } from 'react';

type TPasswordResetModalProps = {
  open: boolean;
  onSubmit: (password: string) => void;
};

const PasswordResetModal = ({ open, onSubmit }: TPasswordResetModalProps) => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  return (
    <Modal open={open} onClose={() => {}}>
      <ModalDialog>
        <FormControl>
          <FormLabel>새로운 비밀번호</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormControl>
        {password && password.length > 0 && (
          <>
            <FormControl>
              <FormLabel>새로운 비밀번호 확인</FormLabel>
              <Input
                type="password"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
              />
            </FormControl>
            <Button
              onClick={() => {
                onSubmit(password);
              }}
              disabled={password !== passwordConfirm}
            >
              비밀번호 초기화
            </Button>
          </>
        )}
      </ModalDialog>
    </Modal>
  );
};

export default PasswordResetModal;
