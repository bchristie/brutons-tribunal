'use client';

import { useAuth } from '@/src/providers/AuthProvider';
import { DashboardWelcome, DashboardGrid, DashboardStat, RecentActivity } from '../_components';

/**
 * Desktop Admin Dashboard Page
 * Full-featured layout optimized for desktop/tablet
 */
export function DesktopAdminPage() {
  const { user } = useAuth();

  const activities = [
    { icon: '👤', event: 'New user registered', user: 'john.doe@example.com', time: '2 hours ago', status: 'Active', statusColor: 'green' as const },
    { icon: '🎭', event: 'Role permissions updated', user: 'admin@example.com', time: '5 hours ago', status: 'Completed', statusColor: 'blue' as const },
    { icon: '📝', event: 'Content published', user: 'editor@example.com', time: '1 day ago', status: 'Published', statusColor: 'purple' as const },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <DashboardWelcome userName={user?.name} />

      {/* Stats Grid */}
      <DashboardGrid>
        <DashboardStat
          label="Total Users"
          value={12}
          icon="👥"
          subtext="+2 this week"
          color="green"
        />
        <DashboardStat
          label="Total Roles"
          value={3}
          icon="🎭"
          subtext="Admin, Editor, Viewer"
          color="gray"
        />
        <DashboardStat
          label="Permissions"
          value={16}
          icon="🔐"
          subtext="4 resources"
          color="gray"
        />
        <DashboardStat
          label="Updates"
          value={24}
          icon="📝"
          subtext="3 published today"
          color="blue"
        />
      </DashboardGrid>

      {/* Recent Activity Table */}
      <RecentActivity activities={activities} />
    </div>
  );
}
