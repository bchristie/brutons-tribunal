/**
 * Users API calls
 */

export interface UserRole {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
}

export interface UsersListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateUserParams {
  email: string;
  name?: string;
  image?: string;
  phone?: string;
}

export interface UpdateUserParams {
  name?: string;
  image?: string;
  phone?: string;
  updatedAt: string; // Required for concurrency control
}

export interface AssignRoleParams {
  roleId?: string;
  roleName?: string;
}

export interface RemoveRoleParams {
  roleId?: string;
  roleName?: string;
}

/**
 * Fetch list of users with pagination and filtering
 */
export async function fetchUsers(params?: FetchUsersParams): Promise<UsersListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.search) searchParams.append('search', params.search);

  const response = await fetch(`/api/admin/users?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch users');
  }

  return await response.json();
}

/**
 * Fetch a single user by ID
 */
export async function fetchUser(userId: string): Promise<User> {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch user');
  }

  return await response.json();
}

/**
 * Create a new user
 */
export async function createUser(params: CreateUserParams): Promise<User> {
  const response = await fetch('/api/admin/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create user');
  }

  return await response.json();
}

/**
 * Update a user
 */
export async function updateUser(userId: string, params: UpdateUserParams): Promise<User> {
  const response = await fetch(`/api/admin/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update user');
  }

  return await response.json();
}

/**
 * Delete a user
 */
export async function deleteUser(userId: string, updatedAt: string): Promise<void> {
  const searchParams = new URLSearchParams({ updatedAt });
  
  const response = await fetch(`/api/admin/users/${userId}?${searchParams.toString()}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete user');
  }
}

/**
 * Assign a role to a user
 */
export async function assignRoleToUser(userId: string, params: AssignRoleParams): Promise<User> {
  const response = await fetch(`/api/admin/users/${userId}/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to assign role');
  }

  return await response.json();
}

/**
 * Remove a role from a user
 */
export async function removeRoleFromUser(userId: string, params: RemoveRoleParams): Promise<User> {
  const searchParams = new URLSearchParams();
  if (params.roleId) searchParams.append('roleId', params.roleId);
  if (params.roleName) searchParams.append('roleName', params.roleName);

  const response = await fetch(`/api/admin/users/${userId}/roles?${searchParams.toString()}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to remove role');
  }

  return await response.json();
}
