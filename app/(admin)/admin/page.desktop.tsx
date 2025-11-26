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

  // Map API updates to activity items with full desktop details
  const activities = dashboardStats.updates.recentUpdates.map(update => ({
    event: update.title,
    user: update.author,
    time: new Date(update.publishedAt).toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
    }),
    status: update.status.charAt(0).toUpperCase() + update.status.slice(1),
    statusColor: update.statusColor,
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
          label="Updates"
          value={dashboardStats.updates.total}
          icon="📝"
          subtext={`${dashboardStats.updates.publishedToday} published today`}
          color="blue"
        />
      </DashboardGrid>

      {/* Recent Activity Table */}
      <RecentActivity activities={activities} />
    </div>
  );
}
