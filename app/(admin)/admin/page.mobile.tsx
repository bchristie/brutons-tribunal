'use client';

import { useAuth } from '@/src/providers/AuthProvider';
import { DashboardWelcome, DashboardGrid, DashboardStat, RecentActivity } from '../_components';

/**
 * Mobile Admin Dashboard Page
 * Compact layout optimized for mobile devices
 */
export function MobileAdminPage() {
  const { user } = useAuth();

  const activities = [
    { icon: '👤', event: 'New user registered', time: '2 hours ago', statusColor: 'blue' as const },
    { icon: '🎭', event: 'Role permissions updated', time: '5 hours ago', statusColor: 'purple' as const },
    { icon: '📝', event: 'Content published', time: '1 day ago', statusColor: 'green' as const },
  ];

  return (
    <div className="p-4">
      {/* Welcome Section */}
      <DashboardWelcome userName={user?.name} />

      {/* Quick Stats */}
      <DashboardGrid>
        <DashboardStat label="Users" value={12} color="blue" />
        <DashboardStat label="Roles" value={3} color="purple" />
        <DashboardStat label="Updates" value={24} color="green" />
        <DashboardStat label="Permissions" value={16} color="gray" />
      </DashboardGrid>

      {/* Recent Activity */}
      <RecentActivity activities={activities} />
    </div>
  );
}
