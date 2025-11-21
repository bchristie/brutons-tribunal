'use client';

import { useMobileDetection } from '@/src/hooks/useMobileDetection';
import { MobileAdminDashboard, DesktopAdminDashboard } from '../_components';

export default function AdminDashboardPage() {
  const { isMobile } = useMobileDetection();
  
  return isMobile ? <MobileAdminDashboard /> : <DesktopAdminDashboard />;
}
