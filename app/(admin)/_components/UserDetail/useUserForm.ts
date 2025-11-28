'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminApi } from '../../_providers';
import { useNotifications } from '../../_providers';
import { useAuth } from '@/src/providers/auth';
import type { User } from '../../_providers/AdminApiProvider';
import type { UserFormData, RoleChange, UserFormState } from './UserDetail.types';

export function useUserForm(userId?: string, returnUrl?: string) {
  const router = useRouter();
  const { fetchUser, updateUser, createUser, deleteUser, assignRoleToUser, removeRoleFromUser, roles, fetchRoles, isLoading, error } = useAdminApi();
  const { success, error: showError } = useNotifications();
  const { user: currentUser } = useAuth();
  
  const isCreateMode = !userId;
  const isSelf = currentUser?.id === userId;
  const defaultReturnUrl = '/admin/users';
  
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    image: '',
    phone: '',
  });
  const [roleChanges, setRoleChanges] = useState<RoleChange[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Track initial form state for dirty checking
  const [initialFormData, setInitialFormData] = useState<UserFormData>({
    name: '',
    email: '',
    image: '',
    phone: '',
  });
  const [initialRoleIds, setInitialRoleIds] = useState<Set<string>>(new Set());

  // Fetch user and roles on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Always fetch available roles
        await fetchRoles();
        
        if (!isCreateMode) {
          const userData = await fetchUser(userId);
          setUser(userData);
          const initial = {
            name: userData.name || '',
            email: userData.email || '',
            image: userData.image || '',
            phone: userData.phone || '',
          };
          setFormData(initial);
          setInitialFormData(initial);
          setInitialRoleIds(new Set(userData.roles.map(r => r.id)));
        }
      } catch (error) {
        showError('Failed to load data');
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
  }, [userId, isCreateMode]);

  // Calculate if form is dirty
  const isDirty = useCallback(() => {
    if (isCreateMode) {
      // In create mode, dirty if any field has content or roles selected
      return formData.name.trim() !== '' || 
             formData.email.trim() !== '' || 
             formData.image.trim() !== '' ||
             formData.phone.trim() !== '' ||
             roleChanges.length > 0;
    }
    
    // In edit mode, check if any field changed or roles changed
    const formChanged = formData.name !== initialFormData.name ||
                       formData.email !== initialFormData.email ||
                       formData.image !== initialFormData.image ||
                       formData.phone !== initialFormData.phone;
    
    const rolesChanged = roleChanges.length > 0;
    
    return formChanged || rolesChanged;
  }, [formData, initialFormData, roleChanges, isCreateMode]);

  const handleFieldChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleRole = (roleId: string, roleName: string, currentlyHas: boolean) => {
    // Check if there's already a pending change for this role
    const pendingAddIndex = roleChanges.findIndex(
      c => c.roleId === roleId && c.action === 'add'
    );
    const pendingRemoveIndex = roleChanges.findIndex(
      c => c.roleId === roleId && c.action === 'remove'
    );
    
    // If there's a pending add, cancel it
    if (pendingAddIndex !== -1) {
      setRoleChanges(roleChanges.filter((_, i) => i !== pendingAddIndex));
      return;
    }
    
    // If there's a pending remove, cancel it
    if (pendingRemoveIndex !== -1) {
      setRoleChanges(roleChanges.filter((_, i) => i !== pendingRemoveIndex));
      return;
    }
    
    // No pending changes - add a new change based on current state
    if (currentlyHas) {
      // Currently has role - schedule for removal
      setRoleChanges([
        ...roleChanges,
        { roleId, roleName, action: 'remove' }
      ]);
    } else {
      // Currently doesn't have role - schedule for add
      setRoleChanges([
        ...roleChanges,
        { roleId, roleName, action: 'add' }
      ]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isCreateMode) {
        // Create new user
        const newUser = await createUser({
          name: formData.name,
          email: formData.email,
          image: formData.image,
          phone: formData.phone,
        });
        
        // Apply role changes
        for (const change of roleChanges) {
          if (change.action === 'add') {
            await assignRoleToUser(newUser.id, { roleId: change.roleId });
          }
        }
        
        success('User created successfully');
        router.push(returnUrl || defaultReturnUrl);
      } else {
        // Update existing user
        if (!user) throw new Error('User not found');
        
        const updatedUser = await updateUser(userId!, {
          name: formData.name,
          image: formData.image,
          phone: formData.phone,
          updatedAt: user.updatedAt,
        });

        // Apply role changes
        for (const change of roleChanges) {
          if (change.action === 'add') {
            await assignRoleToUser(userId!, { roleId: change.roleId });
          } else {
            await removeRoleFromUser(userId!, { roleId: change.roleId });
          }
        }

        // Refresh user data to get updated roles
        const refreshedUser = await fetchUser(userId!);
        setUser(refreshedUser);
        const newInitial = {
          name: refreshedUser.name || '',
          email: refreshedUser.email || '',
          image: refreshedUser.image || '',
          phone: refreshedUser.phone || '',
        };
        setFormData(newInitial);
        setInitialFormData(newInitial);
        setInitialRoleIds(new Set(refreshedUser.roles.map(r => r.id)));
        setRoleChanges([]);
        
        success('User updated successfully');
      }
    } catch (error: any) {
      showError(error?.message || `Failed to ${isCreateMode ? 'create' : 'update'} user`);
      console.error(`Failed to ${isCreateMode ? 'create' : 'update'} user:`, error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isCreateMode) {
      router.push(returnUrl || defaultReturnUrl);
    } else {
      setFormData(initialFormData);
      setRoleChanges([]);
    }
  };

  // Check if user has a role (accounting for pending changes)
  const hasRole = (roleId: string): boolean => {
    if (isCreateMode) {
      return roleChanges.some(c => c.roleId === roleId && c.action === 'add');
    }
    
    if (!user) return false;
    
    const currentlyHas = initialRoleIds.has(roleId);
    const pendingChange = roleChanges.find(c => c.roleId === roleId);
    
    if (pendingChange) {
      return pendingChange.action === 'add' ? true : false;
    }
    
    return currentlyHas;
  };

  // Check if a role has pending changes
  const isPending = (roleId: string): boolean => {
    return roleChanges.some(c => c.roleId === roleId);
  };

  const handleDelete = async () => {
    if (!user || !userId) return;
    
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setIsSaving(true);
    try {
      await deleteUser(userId, user.updatedAt);
      success('User deleted successfully');
      router.push(returnUrl || defaultReturnUrl);
    } catch (error: any) {
      showError(error?.message || 'Failed to delete user');
      setIsSaving(false);
    }
  };

  return {
    user,
    formData,
    roleChanges,
    isLoading,
    isSaving,
    error,
    isDirty: isDirty(),
    isCreateMode,
    isSelf,
    roles,
    handleFieldChange,
    handleToggleRole,
    handleSave,
    handleCancel,
    handleDelete,
    hasRole,
    isPending,
  };
}
