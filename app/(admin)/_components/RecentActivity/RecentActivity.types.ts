export interface ActivityItem {
  icon?: string;
  event: string;
  user?: string;
  time: string;
  status?: string;
  statusColor?: 'green' | 'blue' | 'purple' | 'gray';
}

export interface RecentActivityProps {
  activities: ActivityItem[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}
