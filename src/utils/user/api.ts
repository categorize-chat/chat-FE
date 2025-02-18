import { API, defaultAxiosErrorHandler, defaultResponseHandler } from '../api';
import { TUserUpdateRequest, TUserUpdateResponse } from './type';

const userApi = {
  updateUserInfo: async (req: TUserUpdateRequest) => {
    return await API.json
      .post(`/settings/nickname-change`, req)
      .then(defaultResponseHandler<TUserUpdateResponse>)
      .catch(defaultAxiosErrorHandler);
  },
};
export default userApi;
