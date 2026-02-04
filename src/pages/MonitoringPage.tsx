import { DashboardLayout } from '../layouts/DashboardLayout';
import { StatusPanel } from '../features/dashboard/components/StatusPanel';
import { ChartSection } from '../features/dashboard/components/ChartSection';
import { LogList } from '../features/dashboard/components/LogList';
import { useDataStream } from '../features/dashboard/hooks/useDataStream';

export const MonitoringPage = () => {
  //  핵심: 데이터 스트림 엔진 가동 (Start 버튼 클릭 시 동작)
  useDataStream();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 h-full">
        
        {/* Top Section: Metrics (Fixed Height) */}
        <div className="shrink-0 h-[140px]">
          <StatusPanel />
        </div>

        {/* Main Section: Chart & Logs (Fill Remaining) */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Left: Chart (Takes 2/3 width) */}
          <div className="lg:col-span-2 h-full">
            <ChartSection />
          </div>

          {/* Right: Logs (Takes 1/3 width) */}
          <div className="h-full min-h-0">
            <LogList />
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
};