import { API, defaultAxiosErrorHandler, defaultResponseHandler } from '../api';
import { TApiResponse } from '../type';
import {
  TUserLoginRequest,
  TUserJoinRequest,
  TUserUpdateRequest,
  TUserUpdateResponse,
  TUserAuthResponse,
  TUserKakaoLoginRequest,
  TUserLogoutResponse,
  TUserUpdateProfileImageRequest,
  TUserRequestPasswordResetRequest,
  TUserValidatePasswordResetResponse,
  TUserResetPasswordRequest,
} from './type';

const userApi = {
  async login(req: TUserLoginRequest) {
    return await API.json
      .post(`/user/login`, req)
      .then(defaultResponseHandler<TUserAuthResponse>)
      .catch(defaultAxiosErrorHandler);
  },
  async join(req: TUserJoinRequest) {
    return await API.json
      .post(`/user/join`, req)
      .then(defaultResponseHandler<TUserAuthResponse>)
      .catch(defaultAxiosErrorHandler);
  },
  async logout() {
    return await API.json
      .post(`/user/logout`)
      .then(defaultResponseHandler<TUserLogoutResponse>)
      .catch(defaultAxiosErrorHandler);
  },
  async kakaoLogin(req: TUserKakaoLoginRequest) {
    return await API.json
      .post(`/oauth/kakao`, req)
      .then(defaultResponseHandler<TUserAuthResponse>)
      .catch(defaultAxiosErrorHandler);
  },

  async updateNickname(req: TUserUpdateRequest) {
    return await API.json
      .post(`/settings/nickname-change`, req)
      .then(defaultResponseHandler<TUserUpdateResponse>)
      .catch(defaultAxiosErrorHandler);
  },
  async updateProfileImage(req: TUserUpdateProfileImageRequest) {
    const formData = new FormData();
    formData.append('profileImage', req.file);

    return await API.formData
      .post(`/settings/profile-image`, formData)
      .then(defaultResponseHandler<TUserUpdateResponse>)
      .catch(defaultAxiosErrorHandler);
  },
  async requestPasswordReset(req: TUserRequestPasswordResetRequest) {
    return await API.json
      .post(`/oauth/password-change-request`, req)
      .then(defaultResponseHandler<TApiResponse<null>>)
      .catch(defaultAxiosErrorHandler);
  },
  async validatePasswordReset(code: string) {
    return await API.json
      .get(`/oauth/password-change-request/${code}`)
      .then(defaultResponseHandler<TUserValidatePasswordResetResponse>)
      .catch(defaultAxiosErrorHandler);
  },
  async resetPassword(req: TUserResetPasswordRequest) {
    return await API.json
      .post(`/oauth/reset-password`, req)
      .then(defaultResponseHandler<TApiResponse<null>>)
      .catch(defaultAxiosErrorHandler);
  },
};
export default userApi;
