import { TUserInfoResponse, TUserJoinRequest, TUserJoinResponse } from './type';
import { API, defaultResponseHandler } from '../api';

export const userJoinQuery = () => ({
  mutationFn: async (req: TUserJoinRequest) => {
    return await API.json
      .post('/user', req)
      .then(defaultResponseHandler<TUserJoinResponse>);
  },
  refetchOnWindowFocus: false,
});

export const userInfoQuery = (id: string) => ({
  queryKey: ['userInfo', id],
  queryFn: async () => {
    return await API.json
      .get(`/user/${id}`)
      .then(defaultResponseHandler<TUserInfoResponse>);
  },
  refetchOnWindowFocus: false,
});
