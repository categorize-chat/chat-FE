import { Box, Button, Input, Modal } from '@mui/joy';
import { Typography } from '@mui/material';
import { useChatStore } from '../../state/chat';
import { useMutation } from 'react-query';
import { chatRoomGenerateQuery } from '../../utils/chat/query';
import { ChangeEvent, useRef } from 'react';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  boxShadow: 24,
  borderRadius: 16,
  p: 4,
  display: `flex`,
  flexDirection: `column`,
  gap: `1rem`,
};

const NewChat = () => {
  const { modalOpen, setModalOpen, addChat } = useChatStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const chatRoomGenerateMutation = useMutation({
    ...chatRoomGenerateQuery(),
    onSuccess: ({ channelId, channelName }) => {
      addChat({ channelId, channelName });
      setModalOpen(false);
    },
  });

  const handleNewChat = () => {
    // TODO: change with modal's value
    if (inputRef.current === null) return;

    chatRoomGenerateMutation.mutate({
      channelName: inputRef.current.value,
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (inputRef.current === null) return;
    inputRef.current.value = e.target.value;
  };

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} boxShadow={3}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            채팅방 생성
          </Typography>
          <Input
            placeholder="생성할 채팅방의 이름을 입력해주세요"
            ref={inputRef}
            onChange={handleInputChange}
          />
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              marginLeft: 'auto',
            }}
          >
            <Button variant="outlined" onClick={() => setModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleNewChat}>생성</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default NewChat;
