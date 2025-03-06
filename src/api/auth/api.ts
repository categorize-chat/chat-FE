import { API, defaultAxiosErrorHandler, defaultResponseHandler } from '../api';
import { TValidateEmailResponse } from './type';

const authApi = {
  async validateEmail(token: string) {
    return await API.json
      .post(`/oauth/verify/${token}`)
      .then(defaultResponseHandler<TValidateEmailResponse>)
      .catch(defaultAxiosErrorHandler);
  },

  async resendEmail(email: string) {
    return await API.json
      .post('/oauth/resend-verification', { email })
      .then(defaultResponseHandler<TValidateEmailResponse>)
      .catch(defaultAxiosErrorHandler);
  },
};

export default authApi;
