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
    }>;
  };
  timestamp: string;
}

export interface AdminApiContextValue {
  // Dashboard
  dashboardStats: DashboardStats | null;
  isLoadingDashboard: boolean;
  dashboardError: string | null;
  refreshDashboard: () => Promise<void>;
  
  // Add more admin API methods here as needed
  // users: { ... }
  // roles: { ... }
  // etc.
}

export interface AdminApiProviderProps {
  children: React.ReactNode;
}
