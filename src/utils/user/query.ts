import { TUserInfoResponse } from './type';
import { API, defaultResponseHandler, defaultAxiosErrorHandler } from '../api';

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
