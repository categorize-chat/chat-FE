import { API } from '../api';
import { TUserUpdateRequest, TUserUpdateResponse } from './type';

const userApi = {
  updateUserInfo: async (req: TUserUpdateRequest) => {
    return await API.json
      .post(`/settings/nickname-change`, req)
      .then(res => res.data as TUserUpdateResponse)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return result;
      });
  },
};

export default userApi;
