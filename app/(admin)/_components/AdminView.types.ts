export interface AdminViewProps {
  className?: string;
}

export interface AdminDashboardData {
  totalUsers: number;
  totalRoles: number;
  totalPermissions: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: Date;
  }>;
}
