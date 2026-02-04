import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  className?: string;
  children: ReactNode;
  headerAction?: ReactNode; // 제목 옆에 버튼 등을 배치할 경우 (옵션)
}

export const Card = ({ title, className = '', children, headerAction }: CardProps) => {
  return (
    <div 
      className={`
        bg-gray-800/80 border border-gray-700 rounded-lg overflow-hidden flex flex-col
        shadow-lg backdrop-blur-sm
        ${className}
      `}
    >
      {/* Header Section (조건부 렌더링) */}
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50 bg-gray-800/50 shrink-0">
          <h2 className="text-sm font-semibold text-gray-100 tracking-wide uppercase">
            {title}
          </h2>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1 min-h-0 relative">
        {children}
      </div>
    </div>
  );
};