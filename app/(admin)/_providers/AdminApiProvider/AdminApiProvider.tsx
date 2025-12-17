'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { AdminApiContextValue, AdminApiProviderProps, CachedData } from './AdminApiProvider.types';
import type { DashboardStats } from './api/dashboard';
import type { UsersListResponse } from './api/users';
import type { Role } from './api/roles';
import type { UpdatesListResponse } from './api/updates';
import * as dashboardApi from './api/dashboard';
import * as usersApi from './api/users';
import * as rolesApi from './api/roles';
import * as updatesApi from './api/updates';

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
  // Cache state
  const [dashboardCache, setDashboardCache] = useState<CachedData<DashboardStats> | null>(null);
  const [usersCache, setUsersCache] = useState<CachedData<UsersListResponse> | null>(null);
  const [usersCacheParams, setUsersCacheParams] = useState<usersApi.FetchUsersParams | null>(null);
  const [rolesCache, setRolesCache] = useState<CachedData<Role[]> | null>(null);
  const [updatesCache, setUpdatesCache] = useState<CachedData<UpdatesListResponse> | null>(null);
  const [updatesCacheParams, setUpdatesCacheParams] = useState<updatesApi.FetchUpdatesParams | null>(null);

  // Generic state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to check if cache is stale
  const isCacheStale = useCallback((cache: CachedData<any> | null) => {
    if (!cache) return true;
    return Date.now() - cache.timestamp > CACHE_TTL;
  }, []);

  // Dashboard methods
  const isDashboardStale = useCallback(() => isCacheStale(dashboardCache), [dashboardCache, isCacheStale]);

  const refreshDashboard = useCallback(async (force = false) => {
    // Skip if cache is fresh and not forcing
    if (!force && !isDashboardStale()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await dashboardApi.fetchDashboard();
      setDashboardCache({
        data,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isDashboardStale]);

  // Users methods
  const isUsersStale = useCallback(() => isCacheStale(usersCache), [usersCache, isCacheStale]);

  const fetchUsers = useCallback(async (params?: usersApi.FetchUsersParams, force = false) => {
    // Check if params changed (need to refetch even if cache is fresh)
    const paramsChanged = JSON.stringify(params) !== JSON.stringify(usersCacheParams);
    
    // Skip if cache is fresh, not forcing, and params haven't changed
    if (!force && !isUsersStale() && !paramsChanged) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await usersApi.fetchUsers(params);
      setUsersCache({
        data,
        timestamp: Date.now(),
      });
      setUsersCacheParams(params || null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isUsersStale, usersCacheParams]);

  const fetchUser = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await usersApi.fetchUser(userId);
      return user;
    } catch (err) {
      console.error('Error fetching user:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (params: usersApi.CreateUserParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await usersApi.createUser(params);
      // Invalidate users cache
      setUsersCache(null);
      return user;
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userId: string, params: usersApi.UpdateUserParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await usersApi.updateUser(userId, params);
      // Invalidate users cache
      setUsersCache(null);
      return user;
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId: string, updatedAt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await usersApi.deleteUser(userId, updatedAt);
      // Invalidate users cache
      setUsersCache(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const assignRoleToUser = useCallback(async (userId: string, params: usersApi.AssignRoleParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await usersApi.assignRoleToUser(userId, params);
      // Invalidate users cache
      setUsersCache(null);
      return user;
    } catch (err) {
      console.error('Error assigning role:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeRoleFromUser = useCallback(async (userId: string, params: usersApi.RemoveRoleParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await usersApi.removeRoleFromUser(userId, params);
      // Invalidate users cache
      setUsersCache(null);
      return user;
    } catch (err) {
      console.error('Error removing role:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Roles methods
  const isRolesStale = useCallback(() => isCacheStale(rolesCache), [rolesCache, isCacheStale]);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await rolesApi.fetchRoles();
      setRolesCache({
        data,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Updates methods
  const isUpdatesStale = useCallback(() => isCacheStale(updatesCache), [updatesCache, isCacheStale]);

  const fetchUpdates = useCallback(async (params?: updatesApi.FetchUpdatesParams, force = false) => {
    // Check if params changed (need to refetch even if cache is fresh)
    const paramsChanged = JSON.stringify(params) !== JSON.stringify(updatesCacheParams);
    
    // Skip if cache is fresh, not forcing, and params haven't changed
    if (!force && !isUpdatesStale() && !paramsChanged) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await updatesApi.fetchUpdates(params);
      setUpdatesCache({
        data,
        timestamp: Date.now(),
      });
      setUpdatesCacheParams(params || null);
    } catch (err) {
      console.error('Error fetching updates:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isUpdatesStale, updatesCacheParams]);

  const fetchUpdate = useCallback(async (updateId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const update = await updatesApi.fetchUpdate(updateId);
      return update;
    } catch (err) {
      console.error('Error fetching update:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUpdate = useCallback(async (params: updatesApi.CreateUpdateParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const update = await updatesApi.createUpdate(params);
      // Invalidate updates cache
      setUpdatesCache(null);
      return update;
    } catch (err) {
      console.error('Error creating update:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUpdate = useCallback(async (updateId: string, params: updatesApi.UpdateUpdateParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const update = await updatesApi.updateUpdate(updateId, params);
      // Invalidate updates cache
      setUpdatesCache(null);
      return update;
    } catch (err) {
      console.error('Error updating update:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUpdate = useCallback(async (updateId: string, updatedAt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await updatesApi.deleteUpdate(updateId, updatedAt);
      // Invalidate updates cache
      setUpdatesCache(null);
    } catch (err) {
      console.error('Error deleting update:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cache management
  const clearCache = useCallback(() => {
    setDashboardCache(null);
    setUsersCache(null);
    setRolesCache(null);
    setUpdatesCache(null);
    setError(null);
  }, []);

  const value: AdminApiContextValue = {
    // Dashboard
    dashboardStats: dashboardCache?.data ?? null,
    refreshDashboard,
    isDashboardStale,

    // Users
    users: usersCache?.data ?? null,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    assignRoleToUser,
    removeRoleFromUser,
    isUsersStale,

    // Roles
    roles: rolesCache?.data ?? null,
    fetchRoles,
    isRolesStale,

    // Updates
    updates: updatesCache?.data ?? null,
    fetchUpdates,
    fetchUpdate,
    createUpdate,
    updateUpdate,
    deleteUpdate,
    isUpdatesStale,

    // Generic state
    isLoading,
    error,

    // Cache management
    clearCache,
  };

  return (
    <AdminApiContext.Provider value={value}>
      {children}
    </AdminApiContext.Provider>
  );
}
