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
import { useEffect, useState } from 'react';

/**
 * Desktop Admin Dashboard Page
 * Full-featured layout optimized for desktop/tablet
 */
export function DesktopAdminPage() {
  const { user } = useAuth();
  const { dashboardStats, isLoading, refreshDashboard } = useAdminApi();
  const [currentPage, setCurrentPage] = useState(1);

  // Load dashboard data on mount (provider checks staleness)
  useEffect(() => {
    refreshDashboard(false, currentPage);
  }, [refreshDashboard, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refreshDashboard(true, page);
  };

  // Show loading state
  if (isLoading || !dashboardStats) {
    return <LoadingSpinner size="lg" message="Loading dashboard..." fullScreen />;
  }

  // Map API audit logs to activity items with full desktop details
  const activities = (dashboardStats.auditLogs || []).map(activity => ({
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
          value={dashboardStats.auditLogs?.length || 0} 
          icon="📝" 
          subtext="Audit log activity" 
          color="blue" 
        />
      </DashboardGrid>

      {/* Recent Activity */}
      <RecentActivity 
        activities={activities}
        page={dashboardStats.auditLogsPagination?.page || 1}
        totalPages={dashboardStats.auditLogsPagination?.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
