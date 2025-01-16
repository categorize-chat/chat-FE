import { Box, Button, FormControl, FormLabel, Input, Textarea } from '@mui/joy';
import { Typography } from '@mui/material';
import { useChatStore } from '../../state/chat';
import { useMutation } from 'react-query';
import { chatRoomGenerateQuery } from '../../utils/chat/query';
import { ChangeEvent, useRef } from 'react';
import Swal from 'sweetalert2';
import ModalBase from '../common/ModalBase';

type TNewChatModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewChatModal = ({ open, setOpen }: TNewChatModalProps) => {
  const { addChat } = useChatStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const chatRoomGenerateMutation = useMutation({
    ...chatRoomGenerateQuery(),
    onSuccess: chat => {
      addChat(chat);
      setOpen(false);
    },
    onError: async (error: any) => {
      const errorMessage = error.response?.data?.message;
      setOpen(false);

      await Swal.fire({
        title: errorMessage || '채팅방 생성 중 오류가 발생했습니다.',
        text: '다른 이름을 사용해주세요.',
        icon: 'error',
      });

      setOpen(errorMessage);
    },
  });

  const handleNewChat = () => {
    // TODO: change with modal's value
    if (!inputRef.current || !descriptionRef.current) {
      alert('이름과 설명을 작성해주세요');
      return;
    }

    chatRoomGenerateMutation.mutate({
      channelName: inputRef.current.value,
      description: descriptionRef.current.value,
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (inputRef.current === null) return;
    inputRef.current.value = e.target.value;
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (descriptionRef.current === null) return;
    descriptionRef.current.value = e.target.value;
  };

  return (
    <>
      <ModalBase open={open} setOpen={setOpen}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          채팅방 생성
        </Typography>
        <FormControl>
          <FormLabel sx={{ color: 'gray', marginBottom: '0.5rem' }}>
            이름 <span style={{ color: 'red' }}>*</span>
          </FormLabel>
          <Input
            required
            placeholder="생성할 채팅방의 이름을 입력해주세요"
            ref={inputRef}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel sx={{ color: 'gray', marginBottom: '0.5rem' }}>
            설명 <span style={{ color: 'red' }}>*</span>
          </FormLabel>
          <Textarea
            required
            placeholder="생성할 채팅방의 설명을 입력해주세요"
            onChange={handleDescriptionChange}
            minRows={3}
            slotProps={{
              textarea: {
                ref: descriptionRef,
              },
            }}
          />
        </FormControl>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            marginLeft: 'auto',
          }}
        >
          <Button variant="outlined" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleNewChat}>생성</Button>
        </Box>
      </ModalBase>
    </>
  );
};

export default NewChatModal;
