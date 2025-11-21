// Types for Permission repository operations

export interface UserPermissions {
  userId: string;
  permissions: Set<string>; // e.g., "users:read", "products:delete"
  roles: string[];
}

export interface Role {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  userId: string;
  roleId: string;
  createdAt: Date;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  createdAt: Date;
}

// Query options for permission operations
export interface PermissionQueryOptions {
  includeRoles?: boolean;
  includePermissions?: boolean;
}
