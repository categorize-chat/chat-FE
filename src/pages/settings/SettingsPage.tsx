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
import { useState, useRef } from 'react';
import userApi from '@/api/user/api';
import Divider from '@mui/joy/Divider';
import Swal from 'sweetalert2';
import ToggleSidebarButton from '@/components/common/header/ToggleSidebarButton';

const Settings = () => {
  const { nickname, profileUrl, email, setNickname, setProfileUrl } =
    useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(nickname);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditNickname = async () => {
    await userApi.updateNickname({ nickname: nicknameInput });

    setIsEditing(false);
    setNickname(nicknameInput);
  };

  const handleEditProfileImage = () => {
    // input 요소 클릭 이벤트 트리거
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const fileData = files[0];

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

      await Swal.fire({
        title: '오류',
        text: '프로필 이미지 업데이트 중 오류가 발생했습니다.',
        icon: 'error',
      });
    }

    // 파일 입력 초기화 (같은 파일 다시 선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRequestPasswordReset = async () => {
    const { message } = await userApi.requestPasswordReset({ email });
    await Swal.fire({
      title: '비밀번호 초기화 요청',
      text: message,
      icon: 'success',
    });
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
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
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
                    onClick={handleRequestPasswordReset}
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
