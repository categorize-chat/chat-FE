import { searchApi } from './api';

export const searchQueryKeys = {
  searchAllRooms: 'searchAllRooms',
};

export const searchAllRoomsQuery = () => ({
  queryKey: [searchQueryKeys.searchAllRooms],
  queryFn: async () => {
    const { result } = await searchApi.searchAllRooms();
    return result;
  },
  staleTime: 1000 * 10,
  cacheTime: 1000 * 60,
});
