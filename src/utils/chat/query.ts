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
      .then((res) => res.data as TChatRoomsResponse)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return result;
      });
  },
});

export const chatMessageQuery = (id: string) => ({
  queryKey: [chatQueryKeys.message, id],
  queryFn: async () => {
    console.log(id);
    if (!id) return;

    return await API.json
      .get(`/chat/${id}`)
      .then((res) => res.data as TChatMessageResponse)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return result;
      });
  },
});

export const chatRoomGenerateQuery = () => ({
  mutationKey: [chatQueryKeys.roomGenerate],
  mutationFn: async (req: TChatRoomGenerateRequest) => {
    return await API.json
      .post(`/chat`, req)
      .then((res) => res.data as TChatRoomGenerateResponse)
      .then(({ code, message, result }) => {
        if (code !== 200) {
          throw new Error(message);
        }

        return result;
      });
  },
});
