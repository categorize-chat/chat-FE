import { TApiResponse } from '../type';

export type TUserProps = {
  nickname: string;
  email: string;
  profileUrl: string;
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

export type TUserOAuthResponse = TApiResponse<
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
