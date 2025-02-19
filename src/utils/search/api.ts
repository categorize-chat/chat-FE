import { API, defaultResponseHandler, defaultAxiosErrorHandler } from '../api';
import { TSearchResponse, TSubscribeResponse } from './type';

export const searchApi = {
  async searchAllRooms() {
    return await API.json
      .get('/search')
      .then(defaultResponseHandler<TSearchResponse>)
      .catch(defaultAxiosErrorHandler);
  },

  async searchGeneralRooms(search: string) {
    return await API.json
      .post('/search', { search })
      .then(defaultResponseHandler<TSearchResponse>)
      .catch(defaultAxiosErrorHandler);
  },

  async subscribeChannel(roomId: string) {
    return await API.json
      .post(`/subscribe/${roomId}`)
      .then(defaultResponseHandler<TSubscribeResponse>)
      .catch(defaultAxiosErrorHandler);
  },

  async unsubscribeChannel(roomId: string) {
    return await API.json
      .post(`/unsubscribe/${roomId}`)
      .then(defaultResponseHandler<TSubscribeResponse>)
      .catch(defaultAxiosErrorHandler);
  },
};
