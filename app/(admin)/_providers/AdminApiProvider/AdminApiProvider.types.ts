import { ReactNode } from 'react';
import type { DashboardStats } from './api/dashboard';
import type { User, UsersListResponse, FetchUsersParams, CreateUserParams, UpdateUserParams, AssignRoleParams, RemoveRoleParams } from './api/users';
import type { Role } from './api/roles';
import type { Update, UpdatesListResponse, FetchUpdatesParams, CreateUpdateParams, UpdateUpdateParams } from './api/updates';

export interface CachedData<T> {
  data: T;
  timestamp: number;
}

export interface AdminApiContextValue {
  // Dashboard
  dashboardStats: DashboardStats | null;
  refreshDashboard: (force?: boolean) => Promise<void>;
  isDashboardStale: () => boolean;

  // Users
  users: UsersListResponse | null;
  fetchUsers: (params?: FetchUsersParams, force?: boolean) => Promise<void>;
  fetchUser: (userId: string) => Promise<User>;
  createUser: (params: CreateUserParams) => Promise<User>;
  updateUser: (userId: string, params: UpdateUserParams) => Promise<User>;
  deleteUser: (userId: string, updatedAt: string) => Promise<void>;
  assignRoleToUser: (userId: string, params: AssignRoleParams) => Promise<User>;
  removeRoleFromUser: (userId: string, params: RemoveRoleParams) => Promise<User>;
  isUsersStale: () => boolean;

  // Roles
  roles: Role[] | null;
  fetchRoles: () => Promise<void>;
  isRolesStale: () => boolean;

  // Updates
  updates: UpdatesListResponse | null;
  fetchUpdates: (params?: FetchUpdatesParams, force?: boolean) => Promise<void>;
  fetchUpdate: (updateId: string) => Promise<Update>;
  createUpdate: (params: CreateUpdateParams) => Promise<Update>;
  updateUpdate: (updateId: string, params: UpdateUpdateParams) => Promise<Update>;
  deleteUpdate: (updateId: string, updatedAt: string) => Promise<void>;
  isUpdatesStale: () => boolean;

  // Generic loading and error state for any admin API operation
  isLoading: boolean;
  error: string | null;

  // Cache management
  clearCache: () => void;
}

export interface AdminApiProviderProps {
  children: ReactNode;
}

// Re-export types from API modules
export type { DashboardStats } from './api/dashboard';
export type { User, UsersListResponse, FetchUsersParams, CreateUserParams, UpdateUserParams, AssignRoleParams, RemoveRoleParams } from './api/users';
export type { Role } from './api/roles';
export type { Update, UpdateAuthor, UpdatesListResponse, FetchUpdatesParams, CreateUpdateParams, UpdateUpdateParams } from './api/updates';
