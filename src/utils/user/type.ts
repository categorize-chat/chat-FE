import { TApiResponse } from '../type';

export type TUserProps = {
  name: string;
  username: string;
  avatar: string;
  online: boolean;
};

export type TUserJoinRequest = {
  nickname: string;
};

export type TUserJoinResponse = TApiResponse<{
  userId: string;
  nickname: string;
}>;

export type TUserInfoResponse = TApiResponse<{
  nickname: string;
}>;

export type TUserOAuthResponse = TApiResponse<{
  accessToken: string;
  nickname: string;
  profileUrl: string;
  email: string;
}>;
