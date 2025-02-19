import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Typography,
} from '@mui/joy';
import { useUserStore } from '../../state/user';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import userApi from '../../utils/user/api';
import Divider from '@mui/joy/Divider';
const Settings = () => {
  const { nickname, profileUrl, email, setNickname } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(nickname);

  const handleEditNickname = async () => {
    await userApi.updateUserInfo({ nickname: nicknameInput });

    setIsEditing(false);
    setNickname(nicknameInput);
  };
  const handleEditProfileImage = async () => {
    alert('준비중입니다.');
    return;

    const file = await (window as any).showOpenFilePicker();
    const fileHandle = file[0];
    const fileData = await fileHandle.getFile();
    const fileBlob = new Blob([fileData], { type: fileData.type });

    const formData = new FormData();
    formData.append('file', fileBlob, fileData.name);

    // TODO: form data 처리
    // const response = await userApi.updateUserInfo(formData);
  };

  return (
    <Box padding={2} width="100%">
      <Box
        marginX="auto"
        width="100%"
        maxWidth="500px"
        marginTop={10}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profileUrl}
              size="lg"
              sx={{ width: '100px', height: '100px' }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'background.surface',
                borderRadius: '100%',
                padding: '4px',
                cursor: 'pointer',
                width: '24px',
                height: '24px',
                boxShadow: 'sm',
                '&:hover': {
                  backgroundColor: 'background.level1',
                },
              }}
              onClick={handleEditProfileImage}
            >
              <EditIcon
                sx={{ fontSize: '1rem', aspectRatio: '1/1', margin: '0' }}
              />
            </Box>
          </Box>
          <Typography marginY={2}>
            환영합니다, <b>{nickname}</b>님!
          </Typography>
        </Box>

        <Divider />

        <Typography level="h4">회원 정보</Typography>
        <Box display="flex" alignItems="center" gap={2} width="100%">
          <Box width="100%" display="flex" flexDirection="column" gap={1}>
            <FormControl>
              <FormLabel>닉네임</FormLabel>
              <Input
                value={nicknameInput}
                size="md"
                endDecorator={
                  <EditIcon
                    sx={{ fontSize: '1rem', aspectRatio: '1/1', margin: '0' }}
                  />
                }
                onChange={e => {
                  setIsEditing(true);
                  setNicknameInput(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>이메일</FormLabel>
              <Input value={email} size="md" disabled />
            </FormControl>
          </Box>
        </Box>

        {isEditing && (
          <Button
            sx={{ marginTop: 2 }}
            variant="outlined"
            onClick={handleEditNickname}
          >
            회원 정보 수정
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Settings;
