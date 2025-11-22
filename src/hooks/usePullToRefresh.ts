import { useEffect, useState, useCallback, useRef } from 'react';

interface UsePullToRefreshOptions {
  threshold?: number; // How far to pull before triggering (default: 80px)
  resistance?: number; // Pull resistance factor (default: 2.5)
  onRefresh: () => Promise<void> | void;
}

/**
 * usePullToRefresh Hook
 * Enables pull-to-refresh gesture on mobile/touch devices
 * 
 * @example
 * const { isRefreshing, pullDistance } = usePullToRefresh({
 *   onRefresh: async () => {
 *     await fetchData();
 *   }
 * });
 */
export function usePullToRefresh({ 
  threshold = 80, 
  resistance = 2.5,
  onRefresh 
}: UsePullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only trigger if scrolled to top
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling.current || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    // Only allow pulling down
    if (distance > 0 && window.scrollY === 0) {
      // Apply resistance to make it feel natural
      const adjustedDistance = distance / resistance;
      setPullDistance(adjustedDistance);

      // Prevent default scroll behavior while pulling
      if (adjustedDistance > 10) {
        e.preventDefault();
      }
    }
  }, [isRefreshing, resistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;
    
    isPulling.current = false;

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(0);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    } else {
      // Snap back if threshold not reached
      setPullDistance(0);
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  useEffect(() => {
    const options = { passive: false };
    
    // Disable native pull-to-refresh while this hook is active
    const originalOverscroll = document.body.style.overscrollBehaviorY;
    document.body.style.overscrollBehaviorY = 'contain';
    
    document.addEventListener('touchstart', handleTouchStart, options);
    document.addEventListener('touchmove', handleTouchMove, options);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      // Restore original overscroll behavior on cleanup
      document.body.style.overscrollBehaviorY = originalOverscroll;
      
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isRefreshing,
    pullDistance,
    isThresholdReached: pullDistance >= threshold,
  };
}
