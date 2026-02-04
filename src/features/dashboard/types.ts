export type LogSeverity = 'normal' | 'warning' | 'error';

export interface LogItem {
  id: string;
  timestamp: number; // Unix timestamp
  level: LogSeverity;
  message: string;
  source: string; // ex: "Sensor-A1", "Auth-Module"
}

export interface MetricItem {
  id: string;
  label: string;
  value: number;
  unit: string;
  status: 'stable' | 'critical'; // 차트/뱃지 색상 결정용
}

export interface DashboardData {
  logs: LogItem[];
  metrics: MetricItem[];
}