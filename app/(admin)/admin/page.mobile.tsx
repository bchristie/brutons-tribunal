'use client';

import { useAuth } from '@/src/providers/AuthProvider';
import { useAdminApi } from '../_providers/AdminApiProvider';
import { usePullToRefresh } from '@/src/hooks';
import { RefreshIndicator } from '@/src/components';
import { 
  DashboardWelcome, 
  DashboardGrid, 
  DashboardStat, 
  RecentActivity,
  LoadingSpinner 
} from '../_components';
import { useEffect } from 'react';

/**
 * Mobile Admin Dashboard Page
 * Compact layout optimized for mobile devices
 */
export function MobileAdminPage() {
  const { user } = useAuth();
  const { dashboardStats, isLoading, refreshDashboard } = useAdminApi();
  
  // Load dashboard data on mount (provider checks staleness)
  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);
  
  // Pull-to-refresh gesture (force refresh)
  const { isRefreshing, pullDistance, isThresholdReached } = usePullToRefresh({
    onRefresh: () => refreshDashboard(true),
  });

  // Show loading state
  if (isLoading || !dashboardStats) {
    return <LoadingSpinner size="md" message="Loading dashboard..." fullScreen />;
  }

  // Map API audit logs to activity items
  const activities = (dashboardStats.auditLogs || []).map(activity => ({
    event: activity.title,
    time: new Date(activity.publishedAt).toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
    }),
    statusColor: activity.statusColor,
  }));

  return (
    <div className="p-4">
      {/* Pull-to-Refresh Indicator */}
      <RefreshIndicator 
        isRefreshing={isRefreshing}
        pullDistance={pullDistance}
        isThresholdReached={isThresholdReached}
      />

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
          label="Actions" 
          value={dashboardStats.auditLogs?.length || 0} 
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
