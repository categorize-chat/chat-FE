import { TApiResponse } from '../type';
import { TUserProps } from '@/types';

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

export type TUserLogoutResponse = TApiResponse<null>;

export type TUserUpdateRequest = {
  nickname: string;
};

export type TUserUpdateProfileImageRequest = {
  file: File;
};

export type TUserUpdateResponse = TApiResponse<{
  nickname: string;
  profileUrl?: string;
}>;

export type TUserRequestPasswordResetRequest = {
  email: string;
};

export type TUserValidatePasswordResetResponse = TApiResponse<{
  email: string;
}>;

export type TUserResetPasswordRequest = {
  token: string;
  password: string;
};
