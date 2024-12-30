import { API } from '../api';

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
