import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, Divider, Chip } from '@mui/joy';
import { socketTestUtils, testScenarios } from '@/utils/socketTestUtils';

// 개발 환경에서만 렌더링되는 소켓 테스트 패널
const SocketTestPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [socketStatus, setSocketStatus] = useState<any>(null);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [scenarioCleanupFunctions, setScenarioCleanupFunctions] = useState<
    Map<string, () => void>
  >(new Map());

  // 소켓 상태 업데이트
  useEffect(() => {
    const updateStatus = () => {
      const status = socketTestUtils.getSocketStatus();
      setSocketStatus(status);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // 시나리오 실행
  const executeScenario = (scenarioName: string) => {
    // 이전 시나리오 정리
    scenarioCleanupFunctions.forEach(cleanup => cleanup());
    setScenarioCleanupFunctions(new Map());

    const scenario = testScenarios.find(s => s.name === scenarioName);
    if (scenario) {
      const cleanupFn = scenario.execute();
      if (cleanupFn && typeof cleanupFn === 'function') {
        setScenarioCleanupFunctions(new Map([[scenarioName, cleanupFn]]));
      }
      setActiveScenario(scenarioName);
    }
  };

  // 시나리오 중지
  const stopScenario = () => {
    scenarioCleanupFunctions.forEach(cleanup => cleanup());
    setScenarioCleanupFunctions(new Map());
    socketTestUtils.resetToNormal();
    setActiveScenario(null);
  };

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <>
      {/* 토글 버튼 */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
          backgroundColor: '#FF6B6B',
          color: 'white',
          '&:hover': {
            backgroundColor: '#FF5252',
          },
        }}
      >
        🧪 Socket Test
      </Button>

      {/* 테스트 패널 */}
      {isOpen && (
        <Card
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: 400,
            maxHeight: 600,
            overflowY: 'auto',
            zIndex: 9998,
            backgroundColor: 'background.surface',
            boxShadow: 'lg',
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography level="h4" sx={{ mb: 2 }}>
              Socket 테스트 패널
            </Typography>

            {/* 현재 소켓 상태 */}
            <Box sx={{ mb: 2 }}>
              <Typography level="body-sm" sx={{ mb: 1 }}>
                현재 소켓 상태:
              </Typography>
              <Chip
                color={
                  socketStatus?.status === 'connected' ? 'success' : 'danger'
                }
                variant="soft"
              >
                {socketStatus?.status === 'connected'
                  ? '🟢 연결됨'
                  : '🔴 연결 끊김'}
              </Chip>
              {socketStatus?.id && (
                <Typography level="body-xs" sx={{ mt: 1 }}>
                  ID: {socketStatus.id}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 활성 시나리오 */}
            {activeScenario && (
              <Box sx={{ mb: 2 }}>
                <Typography level="body-sm" sx={{ mb: 1 }}>
                  활성 시나리오:
                </Typography>
                <Chip color="warning" variant="soft">
                  {activeScenario}
                </Chip>
                <Button
                  size="sm"
                  color="neutral"
                  onClick={stopScenario}
                  sx={{ ml: 1 }}
                >
                  중지
                </Button>
              </Box>
            )}

            {/* 테스트 시나리오 목록 */}
            <Typography level="body-sm" sx={{ mb: 2 }}>
              테스트 시나리오:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {testScenarios.map(scenario => (
                <Box key={scenario.name}>
                  <Button
                    size="sm"
                    variant="outlined"
                    color={
                      activeScenario === scenario.name ? 'warning' : 'neutral'
                    }
                    onClick={() => executeScenario(scenario.name)}
                    disabled={activeScenario === scenario.name}
                    sx={{ width: '100%', justifyContent: 'flex-start' }}
                  >
                    {scenario.name}
                  </Button>
                  <Typography level="body-xs" sx={{ mt: 0.5, opacity: 0.7 }}>
                    {scenario.description}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* 수동 제어 */}
            <Typography level="body-sm" sx={{ mb: 2 }}>
              수동 제어:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                size="sm"
                color="danger"
                onClick={() => socketTestUtils.simulateNetworkFailure()}
              >
                연결 강제 해제
              </Button>
              <Button
                size="sm"
                color="success"
                onClick={() => socketTestUtils.resetToNormal()}
              >
                정상 연결 복구
              </Button>
            </Box>

            {/* 사용법 안내 */}
            <Divider sx={{ my: 2 }} />
            <Typography level="body-xs" sx={{ opacity: 0.7 }}>
              💡 콘솔에서 직접 사용:
              <br />
              <code>window.socketTestUtils.simulateNetworkFailure()</code>
            </Typography>
          </Box>
        </Card>
      )}
    </>
  );
};

export default SocketTestPanel;
