import { API } from '../api';
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
    return await API.json
      .get(`/chat`)
      .then(res => res.data as TChatRoomsResponse)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return result;
      });
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
      .then(res => res.data as TChatMessageResponse)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return {
          messages: result.messages,
          nextCursor: result.nextCursor,
        };
      });
  },
  refetchOnWindowFocus: false,
  cacheTime: 0,
  staleTime: 0,
});

export const chatRoomGenerateQuery = () => ({
  mutationKey: [chatQueryKeys.roomGenerate],
  mutationFn: async (req: TChatRoomGenerateRequest) => {
    return await API.json
      .post(`/chat`, req)
      .then(res => res.data as TChatRoomGenerateResponse)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return result;
      });
  },
  refetchOnWindowFocus: false,
});
