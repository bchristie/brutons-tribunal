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

export interface CachedData<T> {
  data: T;
  timestamp: number;
}

export interface AdminApiContextValue {
  // Dashboard
  dashboardStats: DashboardStats | null;
  refreshDashboard: () => Promise<void>;
  isDashboardStale: () => boolean;
  
  // Generic loading and error state for any admin API operation
  isLoading: boolean;
  error: string | null;
  
  // Cache management
  clearCache: () => void;
  
  // Add more admin API methods here as needed
  // users: { ... }
  // roles: { ... }
  // etc.
}

export interface AdminApiProviderProps {
  children: React.ReactNode;
}
