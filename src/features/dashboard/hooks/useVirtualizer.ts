import { useState, useEffect, useMemo } from 'react';
import type { RefObject } from 'react';

interface UseVirtualizerProps {
  itemHeight: number;       // 아이템 하나의 높이 (px)
  containerHeight: number;  // 보여지는 영역 높이 (px)
  totalCount: number;       // 전체 데이터 개수
  overscan?: number;        // 위아래 여유분 (버벅임 방지)
  scrollRef: RefObject<HTMLDivElement | null>; // 스크롤 이벤트 감지할 div
}

export const useVirtualizer = ({
  itemHeight,
  containerHeight,
  totalCount,
  overscan = 5,
  scrollRef,
}: UseVirtualizerProps) => {
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      // requestAnimationFrame으로 스크롤 이벤트 최적화 (60fps 목표)
      requestAnimationFrame(() => {
        setScrollTop(element.scrollTop);
      });
    };

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  // 연산: 보여줄 범위 계산
  const { virtualItems, totalHeight } = useMemo(() => {
    // 1. 전체 스크롤 영역 높이
    const totalHeight = totalCount * itemHeight;

    // 2. 현재 스크롤 위치 기반으로 시작 인덱스 계산
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    
    // 3. 화면 높이 기반으로 끝 인덱스 계산
    const visibleNodeCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(
      totalCount,
      startIndex + visibleNodeCount + (overscan * 2)
    );

    // 4. 실제로 렌더링할 아이템들의 인덱스 배열 생성
    const virtualItems = [];
    for (let i = startIndex; i < endIndex; i++) {
      virtualItems.push({
        index: i,
        offsetTop: i * itemHeight, // 각 아이템의 절대 위치 (top)
      });
    }

    return { 
      virtualItems, 
      totalHeight,
    };
  }, [scrollTop, totalCount, itemHeight, containerHeight, overscan]);

  return { virtualItems, totalHeight };
};