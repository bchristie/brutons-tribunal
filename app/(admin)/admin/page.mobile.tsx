'use client';

import { useAuth } from '@/src/providers/AuthProvider';
import { useAdminApi } from '../_providers/AdminApiProvider';
import { 
  DashboardWelcome, 
  DashboardGrid, 
  DashboardStat, 
  RecentActivity,
  LoadingSpinner 
} from '../_components';

/**
 * Mobile Admin Dashboard Page
 * Compact layout optimized for mobile devices
 */
export function MobileAdminPage() {
  const { user } = useAuth();
  const { dashboardStats, isLoadingDashboard } = useAdminApi();

  // Show loading state
  if (isLoadingDashboard || !dashboardStats) {
    return <LoadingSpinner size="md" message="Loading dashboard..." fullScreen />;
  }

  // Map API updates to activity items
  const activities = dashboardStats.updates.recentUpdates.map(update => ({
    event: update.title,
    time: new Date(update.publishedAt).toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
    }),
    statusColor: update.statusColor,
  }));

  return (
    <div className="p-4">
      {/* Welcome Section */}
      <DashboardWelcome userName={user?.name} />

      {/* Quick Stats */}
      <DashboardGrid>
        <DashboardStat 
          label="Users" 
          value={dashboardStats.users.total} 
          color="blue" 
        />
        <DashboardStat 
          label="Roles" 
          value={dashboardStats.roles.total} 
          color="purple" 
        />
        <DashboardStat 
          label="Updates" 
          value={dashboardStats.updates.total} 
          color="green" 
        />
        <DashboardStat 
          label="Permissions" 
          value={dashboardStats.permissions.total} 
          color="gray" 
        />
      </DashboardGrid>

      {/* Recent Activity */}
      <RecentActivity activities={activities} />
    </div>
  );
}
