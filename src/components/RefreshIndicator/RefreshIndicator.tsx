'use client';

import { RefreshIndicatorProps } from './RefreshIndicator.types';

/**
 * Refresh Indicator Component
 * Visual feedback for pull-to-refresh gesture
 * Shows progress during pull and spinner during refresh
 */
export function RefreshIndicator({ 
  isRefreshing, 
  pullDistance = 0,
  isThresholdReached = false 
}: RefreshIndicatorProps) {
  // Don't render if not pulling or refreshing
  if (!isRefreshing && pullDistance === 0) {
    return null;
  }

  const opacity = Math.min(pullDistance / 60, 1);
  const rotation = isRefreshing ? 0 : pullDistance * 3;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{
        transform: `translateY(${isRefreshing ? '16px' : `${pullDistance}px`})`,
        transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease-out' : 'none',
      }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg"
        style={{ opacity }}
      >
        <svg
          className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''} ${
            isThresholdReached ? 'text-blue-600' : 'text-gray-400'
          }`}
          style={{ 
            transform: isRefreshing ? 'none' : `rotate(${rotation}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </div>
  );
}
