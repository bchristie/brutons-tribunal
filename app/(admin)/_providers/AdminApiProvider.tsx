'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AdminApiContextValue, AdminApiProviderProps, DashboardStats } from './AdminApiProvider.types';

const AdminApiContext = createContext<AdminApiContextValue | undefined>(undefined);

export function useAdminApi() {
  const context = useContext(AdminApiContext);
  if (!context) {
    throw new Error('useAdminApi must be used within AdminApiProvider');
  }
  return context;
}

export function AdminApiProvider({ children }: AdminApiProviderProps) {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const refreshDashboard = useCallback(async () => {
    setIsLoadingDashboard(true);
    setDashboardError(null);

    try {
      const response = await fetch('/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch dashboard data');
      }

      const data: DashboardStats = await response.json();
      setDashboardStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setDashboardError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoadingDashboard(false);
    }
  }, []);

  // Load dashboard stats on mount
  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const value: AdminApiContextValue = {
    dashboardStats,
    isLoadingDashboard,
    dashboardError,
    refreshDashboard,
  };

  return (
    <AdminApiContext.Provider value={value}>
      {children}
    </AdminApiContext.Provider>
  );
}
