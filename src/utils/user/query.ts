import { TUserJoinRequest, TUserJoinResponse } from './type';
import { API } from '../api';

export const userJoinQuery = {
  mutationFn: async (req: TUserJoinRequest) => {
    return await API.json
      .post('/user', req)
      .then((res) => res.data as TUserJoinResponse)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return result;
      });
  },
};
