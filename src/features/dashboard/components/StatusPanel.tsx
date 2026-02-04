import { useDashboardStore } from '../stores/dashboardStore';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

export const StatusPanel = () => {
  const metrics = useDashboardStore((state) => state.metrics);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
      {metrics.map((metric) => (
        <Card key={metric.id} className="min-h-[100px] flex flex-col justify-center">
          <div className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <span className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                {metric.label}
              </span>
              <Badge status={metric.status}>
                {metric.status}
              </Badge>
            </div>
            
            <div className="flex items-end gap-2 mt-1">
              <span className="text-3xl font-bold text-white tabular-nums tracking-tight">
                {metric.value}
              </span>
              <span className="text-gray-500 text-sm font-bold mb-1">
                {metric.unit}
              </span>
            </div>

            {/* Simple Progress Bar Visual */}
            <div className="w-full bg-gray-700/50 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  metric.status === 'critical' ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ 
                  width: `${Math.min(100, (metric.value / (metric.label === 'CPU Usage' ? 100 : metric.value * 1.5)) * 100)}%` 
                }}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};