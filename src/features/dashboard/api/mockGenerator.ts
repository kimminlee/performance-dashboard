import type { LogItem, MetricItem, LogSeverity } from '../types';

// 1. 메모리 최적화를 위한 정적 데이터 풀
const SOURCES = ['Sensor-A1', 'Sensor-B2', 'Auth-Gateway', 'Payment-Worker', 'DB-Shard-01'];
const MESSAGES = [
  'Connection timeout waiting for response',
  'Data packet received successfully',
  'Buffer overflow warning',
  'User authentication failed',
  'Routine health check passed',
];
const SEVERITIES: LogSeverity[] = ['normal', 'normal', 'normal', 'warning', 'error'];

// ID 생성을 위한 고속 카운터 (UUID보다 빠름)
let logIdCounter = 0;

export const generateLogBatch = (count: number): LogItem[] => {
  const batch: LogItem[] = new Array(count);
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const randomSource = SOURCES[Math.floor(Math.random() * SOURCES.length)];
    const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    const randomSeverity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];

    batch[i] = {
      id: `log-${++logIdCounter}`,
      timestamp: now - i * 10, // 약간의 시차 적용
      level: randomSeverity,
      message: `${randomMsg} [${randomSource}]`,
      source: randomSource,
    };
  }
  return batch;
};

export const generateInitialMetrics = (): MetricItem[] => [
  { id: 'm1', label: 'CPU Usage', value: 45, unit: '%', status: 'stable' },
  { id: 'm2', label: 'Memory', value: 2.4, unit: 'GB', status: 'stable' },
  { id: 'm3', label: 'Network In', value: 800, unit: 'Mbps', status: 'stable' },
  { id: 'm4', label: 'Active Users', value: 1240, unit: 'Count', status: 'stable' },
];

export const updateMetrics = (prev: MetricItem[]): MetricItem[] => {
  return prev.map((item) => {
    // -5 ~ +5 랜덤 변동
    const diff = (Math.random() * 10) - 5; 
    const newValue = Math.max(0, parseFloat((item.value + diff).toFixed(1)));
    
    // 임계치 로직 (가상)
    const isCritical = (item.label === 'CPU Usage' && newValue > 90) || 
                       (item.label === 'Memory' && newValue > 10);

    return {
      ...item,
      value: newValue,
      status: isCritical ? 'critical' : 'stable',
    };
  });
};