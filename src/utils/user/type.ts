import { TApiResponse } from '../type';

export type TUserProps = {
  nickname: string;
  email: string;
  profileUrl: string;
};

export type TUserJoinRequest = {
  nickname: string;
  email: string;
  password: string;
};

export type TUserLoginRequest = {
  email: string;
  password: string;
};

export type TUserKakaoLoginRequest = {
  code: string;
};

export type TUserInfoResponse = TApiResponse<{
  nickname: string;
}>;

export type TUserAuthResponse = TApiResponse<
  {
    accessToken: string;
  } & TUserProps
>;

export type TUserUpdateRequest = {
  nickname: string;
};

export type TUserUpdateResponse = TApiResponse<{
  nickname: string;
}>;
