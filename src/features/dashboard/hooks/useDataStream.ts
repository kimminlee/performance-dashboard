import { useEffect } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';
import { generateLogBatch, updateMetrics, generateInitialMetrics } from '../api/mockGenerator';

export const useDataStream = () => {
  const { isRunning, addLogs, setMetrics, metrics } = useDashboardStore();

  // 초기 메트릭 데이터 세팅
  useEffect(() => {
    if (metrics.length === 0) {
      setMetrics(generateInitialMetrics());
    }
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    // 초당 20회(50ms) 업데이트 수행
    const intervalId = setInterval(() => {
      // 1. 로그 생성 (한 번에 2~5개 랜덤 추가)
      const count = Math.floor(Math.random() * 4) + 2; 
      addLogs(generateLogBatch(count));

      // 2. 메트릭 업데이트
      // 중요: setInterval 안에서 최신 state를 가져오기 위해 getState() 직접 호출
      const currentMetrics = useDashboardStore.getState().metrics;
      setMetrics(updateMetrics(currentMetrics));
      
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, addLogs, setMetrics]);
};