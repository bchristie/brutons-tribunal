/**
 * Dashboard API calls
 */

export interface DashboardStats {
  users: {
    total: number;
    newThisWeek: number;
    growth: string;
  };
  roles: {
    total: number;
    names: string[];
  };
  permissions: {
    total: number;
  };
  auditLogs: Array<{
    id: string;
    title: string;
    author: string;
    publishedAt: string;
    status: string;
    statusColor: 'green' | 'blue' | 'purple' | 'gray';
  }>;
  auditLogsPagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  updates: {
    total: number;
    publishedToday: number;
    recentUpdates: Array<{
      id: string;
      title: string;
      author: string;
      publishedAt: string;
      status: string;
      statusColor: 'green' | 'blue' | 'purple' | 'gray';
    }>;
  };
  timestamp: string;
}

export async function fetchDashboard(page: number = 1): Promise<DashboardStats> {
  const response = await fetch(`/api/admin/dashboard?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch dashboard data');
  }

  return await response.json();
}
