'use client';

import { useMobileDetection } from '@/src/hooks/useMobileDetection';
import { ReactNode } from 'react';

/**
 * Dashboard Grid
 * Responsive grid container for dashboard stat cards
 * Mobile: 2-column grid with compact spacing
 * Desktop: 4-column grid with generous spacing
 */
export function DashboardGrid({ children }: { children: ReactNode }) {
  const { isMobile } = useMobileDetection();

  if (isMobile) {
    return <div className="grid grid-cols-2 gap-4 mb-6">{children}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {children}
    </div>
  );
}
