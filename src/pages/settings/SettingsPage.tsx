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

const Settings = () => {
  const { nickname, profileUrl, email, setNickname } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(nickname);

  const handleEditNickname = async () => {
    await userApi.updateUserInfo({ nickname: nicknameInput });

    setIsEditing(false);
    setNickname(nicknameInput);
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
          <Avatar
            src={profileUrl}
            size="lg"
            sx={{ width: '100px', height: '100px' }}
          />
          <Typography marginY={2}>
            환영합니다, <b>{nickname}</b>님!
          </Typography>
        </Box>

        <Typography level="h4">회원 정보</Typography>
        <Box display="flex" alignItems="center" gap={2} width="100%">
          <Box width="100%" display="flex" flexDirection="column" gap={1}>
            <FormControl>
              <FormLabel>닉네임</FormLabel>
              <Input
                value={nicknameInput}
                size="md"
                endDecorator={<EditIcon />}
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
