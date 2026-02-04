import type { ReactNode } from 'react';
import { useDashboardStore } from '../features/dashboard/stores/dashboardStore';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isRunning, toggleStream, clearLogs } = useDashboardStore();

  return (
    <div className="w-screen h-screen bg-gray-900 text-white overflow-hidden flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Header Area */}
      <header className="h-16 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between px-6 shrink-0 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
          <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            NEXUS MONITOR v2.0
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 mr-4 border-r border-gray-700 pr-4">
            <span className="w-2 h-2 rounded-full bg-gray-600"></span>
            CONNECTED
            <span className="w-2 h-2 rounded-full bg-green-500 ml-2"></span>
            LIVE
          </div>

          <button
            onClick={clearLogs}
            className="px-4 py-1.5 text-xs font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded transition-colors"
          >
            CLEAR LOGS
          </button>

          <button
            onClick={toggleStream}
            className={`
              px-6 py-1.5 text-sm font-bold rounded shadow-lg transition-all
              ${isRunning 
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500/30' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30'
              }
            `}
          >
            {isRunning ? 'STOP SYSTEM' : 'START SYSTEM'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 p-4 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/20 via-gray-900 to-black">
        {children}
      </main>
    </div>
  );
};