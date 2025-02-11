import { API } from '../api';
import { TSearchResponse, TSubscribeResponse } from './type';

export const searchApi = {
  searchAllRooms: async () => {
    return await API.json
      .get('/search')
      .then(res => res.data as TSearchResponse)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return result;
      });
  },

  searchGeneralRooms: async (search: string) => {
    return await API.json
      .post('/search', { search })
      .then(res => res.data as TSearchResponse)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return result;
      });
  },

  subscribeChannel: async (roomId: string) => {
    return await API.json
      .post(`/subscribe/${roomId}`)
      .then(res => res.data as TSubscribeResponse)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return result;
      });
  },

  unsubscribeChannel: async (roomId: string) => {
    return await API.json
      .post(`/unsubscribe/${roomId}`)
      .then(res => res.data)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return result;
      });
  },
};
