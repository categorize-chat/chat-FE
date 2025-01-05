import { API } from '../api';
import { TSubscribeResponse } from './type';

export const searchApi = {
  searchGeneralRooms: async (search: string) => {
    return await API.json
      .post('/search', { search })
      .then(res => res.data)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return result;
      });
  },
};

export const subscribeChannel = async (roomId: string) => {
  return await API.json
    .post(`/subscribe/${roomId}`)
    .then(res => res.data as TSubscribeResponse)
    .then(({ code, message, result }) => {
      if (code !== 200) {
        throw new Error(message);
      }

      return result;
    });
};

export const unsubscribeChannel = async (roomId: string) => {
  return await API.json
    .post(`/unsubscribe/${roomId}`)
    .then(res => res.data)
    .then(({ code, message }) => {
      if (code !== 200) {
        throw new Error(message);
      }
    });
};
