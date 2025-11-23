/**
 * Roles API calls
 */

export interface Role {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all roles
 */
export async function fetchRoles(): Promise<Role[]> {
  const response = await fetch('/api/admin/roles', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch roles');
  }

  return await response.json();
}
