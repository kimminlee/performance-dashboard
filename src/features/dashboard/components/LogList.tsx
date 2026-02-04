import { useRef, memo } from 'react';
import type { CSSProperties } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';
import { useVirtualizer } from '../hooks/useVirtualizer';
import { Badge } from '../../../components/ui/Badge';
import type { LogItem } from '../types';

// 1. 개별 행 (Row) - React.memo로 불필요한 리렌더링 방지
const LogRow = memo(({ log, style }: { log: LogItem; style: CSSProperties }) => (
  <div 
    style={style} 
    className="flex items-center gap-3 px-4 border-b border-gray-800/50 hover:bg-gray-700/30 transition-colors text-sm"
  >
    <span className="text-gray-500 w-16 shrink-0 font-mono text-xs">
      {new Date(log.timestamp).toLocaleTimeString()}
    </span>
    
    <div className="w-20 shrink-0 text-center">
      <Badge status={log.level}>{log.level}</Badge>
    </div>

    <span className="text-gray-300 truncate flex-1 font-mono">
      {log.message}
    </span>

    <span className="text-gray-600 text-xs w-24 text-right shrink-0">
      {log.source}
    </span>
  </div>
));

// Display Name for debugging
LogRow.displayName = 'LogRow';

export const LogList = () => {
  // 스토어에서 로그 배열 가져오기
  const logs = useDashboardStore((state) => state.logs);
  
  // 스크롤 컨테이너 Ref
  const parentRef = useRef<HTMLDivElement>(null);

  // 가상화 훅 연결 (높이 36px 고정)
  const { virtualItems, totalHeight } = useVirtualizer({
    itemHeight: 36,
    containerHeight: 400, // CSS 높이와 맞춰야 함 (혹은 동적 측정)
    totalCount: logs.length,
    scrollRef: parentRef,
  });

  return (
    <div className="flex flex-col h-full bg-gray-900/50 rounded-lg">
      <div className="p-3 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
        <h3 className="font-bold text-gray-200">System Logs</h3>
        <span className="text-xs text-gray-500">Total: {logs.length.toLocaleString()}</span>
      </div>

      {/* Scroll Container */}
      <div 
        ref={parentRef} 
        className="flex-1 overflow-y-auto relative contain-strict"
      >
        {/* 가상 스크롤 높이 유지용 투명 div */}
        <div style={{ height: totalHeight, width: '100%' }}>
          {/* 보이는 아이템만 절대 위치로 렌더링 */}
          {virtualItems.map((virtualRow) => {
            const log = logs[virtualRow.index];
            if (!log) return null;

            return (
              <LogRow
                key={log.id} // key는 데이터 ID 사용 (index 금지)
                log={log}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: 36,
                  transform: `translateY(${virtualRow.offsetTop}px)`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};