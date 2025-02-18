import { API, defaultResponseHandler, defaultAxiosErrorHandler } from '../api';
import { TSearchResponse, TSubscribeResponse } from './type';

export const searchApi = {
  searchAllRooms: async () => {
    return await API.json
      .get('/search')
      .then(defaultResponseHandler<TSearchResponse>)
      .catch(defaultAxiosErrorHandler);
  },

  searchGeneralRooms: async (search: string) => {
    return await API.json
      .post('/search', { search })
      .then(defaultResponseHandler<TSearchResponse>)
      .catch(defaultAxiosErrorHandler);
  },

  subscribeChannel: async (roomId: string) => {
    return await API.json
      .post(`/subscribe/${roomId}`)
      .then(defaultResponseHandler<TSubscribeResponse>)
      .catch(defaultAxiosErrorHandler);
  },

  unsubscribeChannel: async (roomId: string) => {
    return await API.json
      .post(`/unsubscribe/${roomId}`)
      .then(defaultResponseHandler<TSubscribeResponse>)
      .catch(defaultAxiosErrorHandler);
  },
};
