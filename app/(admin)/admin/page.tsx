'use client';

import { useMobileDetection } from '@/src/hooks/useMobileDetection';
import { MobileAdminPage } from './page.mobile';
import { DesktopAdminPage } from './page.desktop';

/**
 * Admin Dashboard Page
 * Renders device-specific page variants
 */
export default function AdminDashboardPage() {
  const { isMobile } = useMobileDetection();
  
  return isMobile ? <MobileAdminPage /> : <DesktopAdminPage />;
}
