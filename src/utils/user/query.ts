import { TUserInfoResponse, TUserJoinRequest, TUserJoinResponse } from './type';
import { API, defaultResponseHandler, defaultAxiosErrorHandler } from '../api';

export const userJoinQuery = () => ({
  mutationFn: async (req: TUserJoinRequest) => {
    return await API.json
      .post('/user', req)
      .then(defaultResponseHandler<TUserJoinResponse>)
      .catch(defaultAxiosErrorHandler);
  },
  refetchOnWindowFocus: false,
});

export const userInfoQuery = (id: string) => ({
  queryKey: ['userInfo', id],
  queryFn: async () => {
    return await API.json
      .get(`/user/${id}`)
      .then(defaultResponseHandler<TUserInfoResponse>)
      .catch(defaultAxiosErrorHandler);
  },
  refetchOnWindowFocus: false,
});
