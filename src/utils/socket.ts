import { io, Socket } from 'socket.io-client';

const socketUrl = `${import.meta.env.VITE_SOCK_URL}/chat`;

// 소켓 인스턴스를 저장할 변수
let socketInstance: Socket | null = null;

// 재연결 시 실행할 콜백 함수들
let reconnectCallbacks: (() => void)[] = [];

// 재연결 콜백 등록 함수
export const addReconnectCallback = (callback: () => void): void => {
  reconnectCallbacks.push(callback);
};

// 재연결 콜백 해제 함수
export const removeReconnectCallback = (callback: () => void): void => {
  reconnectCallbacks = reconnectCallbacks.filter(cb => cb !== callback);
};

// 소켓 연결 함수
export const connectSocket = (): Socket => {
  if (socketInstance && socketInstance.connected) {
    console.debug('소켓이 이미 연결되어 있습니다.');
    return socketInstance;
  }

  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error('액세스 토큰이 없습니다. 소켓 연결을 시도할 수 없습니다.');
    throw new Error('액세스 토큰이 없습니다.');
  }

  console.debug('소켓 연결 시도...');
  socketInstance = io(socketUrl, {
    path: '/socket.io',
    withCredentials: true,
    secure: true,
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
  });

  socketInstance.on('connect', () => {
    console.debug('소켓 연결 성공:', socketInstance?.id);

    // 재연결 시 콜백 함수들 실행
    reconnectCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('재연결 콜백 실행 중 오류:', error);
      }
    });
  });

  socketInstance.on('connect_error', error => {
    console.error('소켓 연결 오류:', error);
  });

  socketInstance.on('disconnect', reason => {
    console.debug('소켓 연결 해제:', reason);
  });

  return socketInstance;
};

// 소켓 연결 해제 함수
export const disconnectSocket = (): void => {
  if (socketInstance) {
    console.debug('소켓 연결 해제 중...');
    socketInstance.disconnect();
    socketInstance = null;
  }
};

// 소켓 인스턴스 가져오기 함수
export const getSocket = (): Socket | null => {
  return socketInstance;
};

// 소켓 재연결 함수
export const reconnectSocket = (): Socket | null => {
  disconnectSocket();
  return connectSocket();
};
