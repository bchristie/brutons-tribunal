'use client';

import { useMobileDetection } from '@/src/hooks/useMobileDetection';
import { MobileAdminDashboard } from './MobileAdminDashboard';
import { DesktopAdminDashboard } from './DesktopAdminDashboard';
import type { AdminViewProps } from './AdminView.types';

/**
 * AdminView Component
 * Detects device type and renders appropriate admin interface
 * - Mobile: Streamlined, card-based interface with essential actions
 * - Desktop: Detailed tables, bulk actions, and comprehensive data views
 */
export function AdminView({ className = '' }: AdminViewProps) {
  const { isMobile } = useMobileDetection();

  return (
    <div className={className}>
      {isMobile ? <MobileAdminDashboard /> : <DesktopAdminDashboard />}
    </div>
  );
}
