import { create } from 'zustand';
import type { LogItem, MetricItem } from '../types';

interface DashboardState {
  logs: LogItem[];
  metrics: MetricItem[];
  isRunning: boolean; // 데이터 스트리밍 On/Off
}

interface DashboardActions {
  addLogs: (newLogs: LogItem[]) => void;
  setMetrics: (metrics: MetricItem[]) => void;
  toggleStream: () => void;
  clearLogs: () => void;
}

// 메모리 보호: 최대 보관할 로그 개수
const MAX_LOG_COUNT = 5000;

export const useDashboardStore = create<DashboardState & DashboardActions>((set) => ({
  logs: [],
  metrics: [],
  isRunning: false, // 처음엔 정지 상태

  addLogs: (newLogs) => set((state) => {
    // 성능 최적화: 기존 로그 + 새 로그 합치기
    // 큐(Queue)처럼 작동: 최대 개수를 넘으면 오래된 로그 버림
    const nextLogs = [...state.logs, ...newLogs];
    
    if (nextLogs.length > MAX_LOG_COUNT) {
      return { logs: nextLogs.slice(nextLogs.length - MAX_LOG_COUNT) };
    }
    return { logs: nextLogs };
  }),

  setMetrics: (metrics) => set({ metrics }),

  toggleStream: () => set((state) => ({ isRunning: !state.isRunning })),

  clearLogs: () => set({ logs: [] }),
}));