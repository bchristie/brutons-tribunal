'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AdminApiContextValue, AdminApiProviderProps, DashboardStats, CachedData } from './AdminApiProvider.types';

const AdminApiContext = createContext<AdminApiContextValue | undefined>(undefined);

// Cache TTL: 2 minutes (can be adjusted)
const CACHE_TTL = 2 * 60 * 1000;

export function useAdminApi() {
  const context = useContext(AdminApiContext);
  if (!context) {
    throw new Error('useAdminApi must be used within AdminApiProvider');
  }
  return context;
}

export function AdminApiProvider({ children }: AdminApiProviderProps) {
  const [dashboardCache, setDashboardCache] = useState<CachedData<DashboardStats> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDashboardStale = useCallback(() => {
    if (!dashboardCache) return true;
    return Date.now() - dashboardCache.timestamp > CACHE_TTL;
  }, [dashboardCache]);

  const refreshDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch dashboard data');
      }

      const data: DashboardStats = await response.json();
      setDashboardCache({
        data,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCache = useCallback(() => {
    setDashboardCache(null);
    setError(null);
  }, []);

  const value: AdminApiContextValue = {
    dashboardStats: dashboardCache?.data ?? null,
    refreshDashboard,
    isDashboardStale,
    isLoading,
    error,
    clearCache,
  };

  return (
    <AdminApiContext.Provider value={value}>
      {children}
    </AdminApiContext.Provider>
  );
}
