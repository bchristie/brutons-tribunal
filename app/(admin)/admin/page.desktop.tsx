'use client';

import { useAuth } from '@/src/providers';
import { useAdminApi } from '../_providers';
import { 
  DashboardWelcome, 
  DashboardGrid, 
  DashboardStat, 
  RecentActivity,
  LoadingSpinner 
} from '../_components';
import { useEffect } from 'react';

/**
 * Desktop Admin Dashboard Page
 * Full-featured layout optimized for desktop/tablet
 */
export function DesktopAdminPage() {
  const { user } = useAuth();
  const { dashboardStats, isLoading, refreshDashboard } = useAdminApi();

  // Load dashboard data on mount (provider checks staleness)
  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  // Show loading state
  if (isLoading || !dashboardStats) {
    return <LoadingSpinner size="lg" message="Loading dashboard..." fullScreen />;
  }

  // Map API audit logs to activity items with full desktop details
  const activities = dashboardStats.activity.recent.map(activity => ({
    event: activity.title,
    user: activity.author,
    time: new Date(activity.publishedAt).toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
    }),
    status: activity.status.charAt(0).toUpperCase() + activity.status.slice(1),
    statusColor: activity.statusColor,
  }));

  return (
    <div className="p-8">
      {/* Header */}
      <DashboardWelcome userName={user?.name} />

      {/* Stats Grid */}
      <DashboardGrid>
        <DashboardStat
          label="Total Users"
          value={dashboardStats.users.total}
          icon="👥"
          subtext={`+${dashboardStats.users.newThisWeek} this week`}
          color="green"
        />
        <DashboardStat
          label="Total Roles"
          value={dashboardStats.roles.total}
          icon="🎭"
          subtext={dashboardStats.roles.names.join(', ')}
          color="gray"
        />
        <DashboardStat
          label="Permissions"
          value={dashboardStats.permissions.total}
          icon="🔐"
          subtext={`${dashboardStats.roles.total} roles configured`}
          color="gray"
        />
        <DashboardStat
          label="Recent Actions"
          value={dashboardStats.activity.recent.length}
          icon="📝"
          subtext="Admin activity logs"
          color="blue"
        />
      </DashboardGrid>

      {/* Recent Activity Table */}
      <RecentActivity activities={activities} />
    </div>
  );
}
