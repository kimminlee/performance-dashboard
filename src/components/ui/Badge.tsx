import type { HTMLAttributes, ReactNode } from 'react';

// 타입 정의: 허용할 상태값 목록
type BadgeStatus = 'stable' | 'critical' | 'normal' | 'warning' | 'error';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatus;
  children: ReactNode;
}

export const Badge = ({ status, className = '', children, ...props }: BadgeProps) => {
  return (
    <span
      // 핵심: JS 로직 없이 DOM 속성만 변경
      data-status={status} 
      className={`
        px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider
        transition-colors duration-200
        
        /* Default Style */
        bg-gray-700 text-gray-300

        /* Status: Normal / Stable (Green/Blue) */
        data-[status=normal]:bg-blue-500/20 data-[status=normal]:text-blue-300
        data-[status=stable]:bg-emerald-500/20 data-[status=stable]:text-emerald-300

        /* Status: Warning (Yellow) */
        data-[status=warning]:bg-yellow-500/20 data-[status=warning]:text-yellow-300

        /* Status: Error / Critical (Red + Pulse) */
        data-[status=error]:bg-red-500/20 data-[status=error]:text-red-300
        data-[status=critical]:bg-rose-600/30 data-[status=critical]:text-rose-400 data-[status=critical]:animate-pulse
        
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};