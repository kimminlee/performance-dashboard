import { useState, useEffect, useRef } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useDashboardStore } from '../stores/dashboardStore';
import { Card } from '../../../components/ui/Card';

interface ChartDataPoint {
  time: string;
  cpu: number;
  memory: number;
}

export const ChartSection = () => {
  const metrics = useDashboardStore((state) => state.metrics);
  const isRunning = useDashboardStore((state) => state.isRunning);
  
  // 차트용 데이터 히스토리 (최근 50개 포인트 유지)
  const [data, setData] = useState<ChartDataPoint[]>([]);
  
  // 데이터 업데이트 감지 및 히스토리 누적
  useEffect(() => {
    if (!isRunning || metrics.length === 0) return;

    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    
    // 메트릭에서 CPU, Memory 값 추출
    const cpuMetric = metrics.find(m => m.label === 'CPU Usage');
    const memMetric = metrics.find(m => m.label === 'Memory');

    const newPoint: ChartDataPoint = {
      time: timeStr,
      cpu: cpuMetric ? cpuMetric.value : 0,
      memory: memMetric ? memMetric.value * 10 : 0, // 스케일 보정 (GB -> 10단위)
    };

    setData(prev => {
      const newData = [...prev, newPoint];
      // 50개 이상이면 앞에서부터 자름 (Sliding Window)
      if (newData.length > 50) return newData.slice(newData.length - 50);
      return newData;
    });

  }, [metrics, isRunning]);

  return (
    <Card title="Real-time Analytics" className="h-full min-h-[300px]">
      <div className="w-full h-full p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#9ca3af', fontSize: 10 }} 
              tickLine={false}
              interval={10}
            />
            <YAxis 
              tick={{ fill: '#9ca3af', fontSize: 10 }} 
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Area 
              type="monotone" 
              dataKey="cpu" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorCpu)" 
              strokeWidth={2}
              isAnimationActive={false} // 성능 최적화: 실시간 데이터에는 애니메이션 끔
            />
            <Area 
              type="monotone" 
              dataKey="memory" 
              stroke="#8b5cf6" 
              fillOpacity={1} 
              fill="url(#colorMem)" 
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};