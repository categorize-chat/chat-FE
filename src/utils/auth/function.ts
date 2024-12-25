import { API } from '../api';
import { TUserOAuthResponse } from '../user/type';

type TVaildateTokenArgs = {
  nickname: string;
  email: string;
  profileUrl: string;
};

// 토큰을 검증하고 로그인 여부 확인
export const validateToken = async ({
  nickname,
  email,
  profileUrl,
}: TVaildateTokenArgs) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return false;
  }

  // 토큰 검증 로직

  const userInfo = await API.json
    .get('/user/info', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(res => res.data as TUserOAuthResponse)
    .then(({ isSuccess, result }) => {
      if (!isSuccess) {
        return null;
      }

      return result;
    });

  if (!userInfo) return false;

  if (
    userInfo.nickname !== nickname ||
    userInfo.email !== email ||
    userInfo.profileUrl !== profileUrl
  ) {
    return false;
  }

  console.log('validated');

  return true;
};

export const searchChatRoom = async () => {
  API.json
    .get('/search')
    .then(res => res.data)
    .then(console.log);
};
