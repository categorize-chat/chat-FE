import { API, defaultResponseHandler, defaultAxiosErrorHandler } from '../api';
import {
  TChatMessageResponse,
  TChatRoomGenerateRequest,
  TChatRoomGenerateResponse,
  TChatRoomsResponse,
} from './type';

export const chatQueryKeys = {
  rooms: 'chatRooms',
  message: 'chatMessage',
  roomInfo: 'chatRoomInfo',
  roomGenerate: 'chatRoomGenerate',
};

export const chatRoomsQuery = () => ({
  queryKey: [chatQueryKeys.rooms],
  queryFn: async () => {
    const { result } = await API.json
      .get(`/chat`)
      .then(defaultResponseHandler<TChatRoomsResponse>)
      .catch(defaultAxiosErrorHandler);

    return result;
  },
  refetchOnWindowFocus: false,
});

export const chatMessageQuery = (id: string, limit: number = 20) => ({
  queryKey: [chatQueryKeys.message, id],
  queryFn: async ({ pageParam = null }) => {
    return await API.json
      .get(`/chat/${id}`, {
        params: {
          cursor: pageParam,
          limit,
        },
      })
      .then(defaultResponseHandler<TChatMessageResponse>)
      .then(({ result }) => ({
        messages: result.messages,
        nextCursor: result.nextCursor,
      }));
  },
  refetchOnWindowFocus: false,
  cacheTime: 0,
  staleTime: 0,
});

export const chatRoomGenerateQuery = () => ({
  mutationKey: [chatQueryKeys.roomGenerate],
  mutationFn: async (req: TChatRoomGenerateRequest) => {
    const { result } = await API.json
      .post(`/chat`, req)
      .then(defaultResponseHandler<TChatRoomGenerateResponse>)
      .catch(defaultAxiosErrorHandler);

    return result;
  },
  refetchOnWindowFocus: false,
});
