import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Typography,
} from '@mui/joy';
import { useUserStore } from '@/state/user';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import userApi from '@/api/user/api';
import Divider from '@mui/joy/Divider';
import Swal from 'sweetalert2';
import ToggleSidebarButton from '@/components/common/header/ToggleSidebarButton';

const Settings = () => {
  const { nickname, profileUrl, email, setNickname, setProfileUrl } =
    useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(nickname);

  const handleEditNickname = async () => {
    await userApi.updateNickname({ nickname: nicknameInput });

    setIsEditing(false);
    setNickname(nicknameInput);
  };

  const handleEditProfileImage = async () => {
    try {
      // 파일 선택 다이얼로그 열기
      const file = await (window as any).showOpenFilePicker({
        types: [
          {
            description: '이미지 파일',
            accept: {
              'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
            },
          },
        ],
        multiple: false,
      });

      const fileHandle = file[0];
      const fileData = await fileHandle.getFile();

      // 파일 크기 제한 (10MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (fileData.size > MAX_FILE_SIZE) {
        await Swal.fire({
          title: '파일 크기 초과',
          text: '프로필 이미지는 10MB 이하여야 합니다.',
          icon: 'error',
        });
        return;
      }

      // 이미지 파일 타입 확인
      if (!fileData.type.startsWith('image/')) {
        await Swal.fire({
          title: '지원되지 않는 파일 형식',
          text: '이미지 파일만 업로드 가능합니다.',
          icon: 'error',
        });
        return;
      }

      // API 호출
      const { result } = await userApi.updateProfileImage({ file: fileData });

      // 프로필 이미지 업데이트 성공 시 상태 업데이트
      if (result) {
        setProfileUrl(result.profileUrl || profileUrl);
        await Swal.fire({
          title: '성공',
          text: '프로필 이미지가 업데이트되었습니다.',
          icon: 'success',
        });
      }
    } catch (error) {
      console.error('프로필 이미지 업데이트 실패:', error);
      // 사용자가 파일 선택을 취소한 경우 에러 메시지를 표시하지 않음
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      await Swal.fire({
        title: '오류',
        text: '프로필 이미지 업데이트 중 오류가 발생했습니다.',
        icon: 'error',
      });
    }
  };

  return (
    <>
      <ToggleSidebarButton float />
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
              <FormControl>
                <FormLabel
                  sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ display: 'inline-block' }}>비밀번호</span>
                  <span
                    style={{
                      display: 'inline-block',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                    onClick={() => {}}
                  >
                    변경하기
                  </span>
                </FormLabel>
                <Input value={'********'} size="md" type="password" disabled />
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
    </>
  );
};

export default Settings;
