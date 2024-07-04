import { TUserInfoResponse, TUserJoinRequest, TUserJoinResponse } from './type';
import { API } from '../api';

export const userJoinQuery = () => ({
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
});

export const userInfoQuery = (id: string) => ({
  queryKey: ['userInfo', id],
  queryFn: async () => {
    return await API.json
      .get(`/user/${id}`)
      .then((res) => res.data as TUserInfoResponse)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return result;
      });
  },
});
