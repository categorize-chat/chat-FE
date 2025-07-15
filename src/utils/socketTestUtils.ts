// Socket 연결 장애 시뮬레이션을 위한 테스트 유틸리티
import { getSocket, disconnectSocket, connectSocket } from './socket';

interface TestScenario {
  name: string;
  description: string;
  execute: () => (() => void) | void;
  reset: () => void;
}

// 개발 환경에서만 사용할 테스트 도구
export const socketTestUtils = {
  // 현재 소켓 상태 확인
  getSocketStatus: () => {
    const socket = getSocket();
    if (!socket) {
      return { status: 'disconnected', id: null };
    }
    return {
      status: socket.connected ? 'connected' : 'disconnected',
      id: socket.id,
      transport: socket.io.engine.transport.name,
    };
  },

  // 강제 연결 해제 (네트워크 장애 시뮬레이션)
  simulateNetworkFailure: () => {
    const socket = getSocket();
    if (socket) {
      socket.io.engine.close();
      console.log('🔴 네트워크 장애 시뮬레이션: 연결 강제 해제');
    }
  },

  // 간헐적 연결 해제 (불안정한 네트워크 시뮬레이션)
  simulateUnstableNetwork: (intervalMs: number = 10000) => {
    const interval = setInterval(() => {
      const socket = getSocket();
      if (socket && socket.connected) {
        socket.io.engine.close();
        console.log('🟡 불안정한 네트워크 시뮬레이션: 연결 해제');

        // 2초 후 재연결 시도
        setTimeout(() => {
          try {
            connectSocket();
            console.log('🟢 불안정한 네트워크 시뮬레이션: 재연결 시도');
          } catch (error) {
            console.error('재연결 실패:', error);
          }
        }, 2000);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  },

  // 서버 응답 지연 시뮬레이션
  simulateServerDelay: (delayMs: number = 3000) => {
    const socket = getSocket();
    if (!socket) return;

    const originalEmit = socket.emit.bind(socket);
    socket.emit = function (eventName: string, ...args: any[]) {
      console.log(`⏳ 서버 응답 지연 시뮬레이션: ${delayMs}ms 지연`);
      setTimeout(() => {
        originalEmit(eventName, ...args);
      }, delayMs);
      return socket;
    };

    // 복구 함수 반환
    return () => {
      socket.emit = originalEmit;
      console.log('✅ 서버 응답 지연 시뮬레이션 해제');
    };
  },

  // 메시지 전송 실패 시뮬레이션
  simulateMessageSendFailure: (failureRate: number = 0.5) => {
    const socket = getSocket();
    if (!socket) return;

    const originalEmit = socket.emit.bind(socket);
    socket.emit = function (eventName: string, ...args: any[]) {
      if (eventName === 'message' && Math.random() < failureRate) {
        console.log('❌ 메시지 전송 실패 시뮬레이션');
        // 에러 이벤트 발생
        socket.emit('error', new Error('메시지 전송 실패'));
        return socket;
      }
      return originalEmit(eventName, ...args);
    };

    // 복구 함수 반환
    return () => {
      socket.emit = originalEmit;
      console.log('✅ 메시지 전송 실패 시뮬레이션 해제');
    };
  },

  // 토큰 만료 시뮬레이션
  simulateTokenExpiry: () => {
    localStorage.removeItem('accessToken');
    const socket = getSocket();
    if (socket) {
      socket.io.engine.close();
      console.log('🔐 토큰 만료 시뮬레이션: 인증 토큰 제거 및 연결 해제');
    }
  },

  // 모든 시뮬레이션 중지 및 정상 연결 복구
  resetToNormal: () => {
    disconnectSocket();
    setTimeout(() => {
      try {
        connectSocket();
        console.log('✅ 모든 시뮬레이션 중지 및 정상 연결 복구');
      } catch (error) {
        console.error('정상 연결 복구 실패:', error);
      }
    }, 1000);
  },
};

// 테스트 시나리오 정의
export const testScenarios: TestScenario[] = [
  {
    name: '네트워크 장애',
    description: '갑작스런 네트워크 연결 끊김',
    execute: () => socketTestUtils.simulateNetworkFailure(),
    reset: () => socketTestUtils.resetToNormal(),
  },
  {
    name: '불안정한 네트워크',
    description: '10초마다 연결이 끊어지고 재연결',
    execute: () => socketTestUtils.simulateUnstableNetwork(10000),
    reset: () => socketTestUtils.resetToNormal(),
  },
  {
    name: '서버 응답 지연',
    description: '모든 요청이 3초 지연',
    execute: () => socketTestUtils.simulateServerDelay(3000),
    reset: () => socketTestUtils.resetToNormal(),
  },
  {
    name: '메시지 전송 실패',
    description: '50% 확률로 메시지 전송 실패',
    execute: () => socketTestUtils.simulateMessageSendFailure(0.5),
    reset: () => socketTestUtils.resetToNormal(),
  },
  {
    name: '토큰 만료',
    description: '인증 토큰 만료 상황',
    execute: () => socketTestUtils.simulateTokenExpiry(),
    reset: () => socketTestUtils.resetToNormal(),
  },
];

// 개발 환경에서만 전역 객체에 추가
if (import.meta.env.DEV) {
  (window as any).socketTestUtils = socketTestUtils;
  (window as any).testScenarios = testScenarios;

  console.log('🧪 Socket 테스트 도구가 로드되었습니다.');
  console.log('사용법: window.socketTestUtils.simulateNetworkFailure()');
  console.log('시나리오: window.testScenarios');
}
