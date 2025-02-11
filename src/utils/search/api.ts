import { API, defaultResponseHandler } from '../api';
import { TSearchResponse, TSubscribeResponse } from './type';

export const searchApi = {
  searchAllRooms: async () => {
    return await API.json
      .get('/search')
      .then(defaultResponseHandler<TSearchResponse>);
  },

  searchGeneralRooms: async (search: string) => {
    return await API.json
      .post('/search', { search })
      .then(defaultResponseHandler<TSearchResponse>);
  },

  subscribeChannel: async (roomId: string) => {
    return await API.json
      .post(`/subscribe/${roomId}`)
      .then(defaultResponseHandler<TSubscribeResponse>);
  },

  unsubscribeChannel: async (roomId: string) => {
    return await API.json
      .post(`/unsubscribe/${roomId}`)
      .then(defaultResponseHandler<TSubscribeResponse>);
  },
};
