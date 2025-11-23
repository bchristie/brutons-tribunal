'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminApi } from '../../_providers';
import { useNotifications } from '../../_providers';
import { useMobileDetection } from '@/src/hooks';
import { UserAvatar } from '@/src/components';
import type { User } from '../../_providers/AdminApiProvider';
import type { UserDetailProps, UserFormData, RoleChange } from './UserDetail.types';
import { FaArrowLeft, FaSave, FaTimes, FaPlus } from 'react-icons/fa';

export function UserDetail({ userId, className = '' }: UserDetailProps) {
  const router = useRouter();
  const { fetchUser, updateUser, assignRoleToUser, removeRoleFromUser, roles, fetchRoles, isLoading, error } = useAdminApi();
  const { success, error: showError } = useNotifications();
  const { isMobile } = useMobileDetection();
  
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    image: '',
  });
  const [roleChanges, setRoleChanges] = useState<RoleChange[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user and roles on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchUser(userId);
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          image: userData.image || '',
        });
        
        // Fetch available roles
        await fetchRoles();
      } catch (error) {
        showError('Failed to load user data');
        console.error('Failed to load user:', error);
      }
    };
    
    loadData();
  }, [userId]);

  const handleBack = () => {
    router.push('/admin/users');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        image: user.image || '',
      });
    }
    setRoleChanges([]);
    setSelectedRoleId('');
    setIsEditing(false);
  };

  const handleAddRole = () => {
    if (!selectedRoleId) return;
    
    const role = availableRoles.find(r => r.id === selectedRoleId);
    if (!role) return;

    // Check if already scheduled for removal, if so just cancel that
    const removeIndex = roleChanges.findIndex(
      c => c.roleId === selectedRoleId && c.action === 'remove'
    );
    
    if (removeIndex !== -1) {
      setRoleChanges(roleChanges.filter((_, i) => i !== removeIndex));
    } else {
      // Add new role change
      setRoleChanges([
        ...roleChanges,
        { roleId: role.id, roleName: role.name, action: 'add' }
      ]);
    }
    
    setSelectedRoleId('');
  };

  const handleRemoveRole = (roleId: string, roleName: string) => {
    // Check if this role was scheduled to be added, if so just cancel that
    const addIndex = roleChanges.findIndex(
      c => c.roleId === roleId && c.action === 'add'
    );
    
    if (addIndex !== -1) {
      setRoleChanges(roleChanges.filter((_, i) => i !== addIndex));
    } else {
      // Schedule for removal
      setRoleChanges([
        ...roleChanges,
        { roleId, roleName, action: 'remove' }
      ]);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Update user profile
      const updatedUser = await updateUser(userId, {
        name: formData.name,
        image: formData.image,
        updatedAt: user.updatedAt,
      });

      // Apply role changes
      for (const change of roleChanges) {
        if (change.action === 'add') {
          await assignRoleToUser(userId, { roleId: change.roleId });
        } else {
          await removeRoleFromUser(userId, { roleId: change.roleId });
        }
      }

      // Refresh user data to get updated roles
      const refreshedUser = await fetchUser(userId);
      setUser(refreshedUser);
      setFormData({
        name: refreshedUser.name || '',
        email: refreshedUser.email || '',
        image: refreshedUser.image || '',
      });
      setRoleChanges([]);
      setIsEditing(false);
      
      success('User updated successfully');
    } catch (error: any) {
      showError(error?.message || 'Failed to update user');
      console.error('Failed to update user:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate effective roles (current + pending changes)
  const getEffectiveRoles = () => {
    if (!user) return [];
    
    let effectiveRoles = [...user.roles];
    
    roleChanges.forEach(change => {
      if (change.action === 'add') {
        // Add if not already present
        if (!effectiveRoles.find(r => r.id === change.roleId)) {
          effectiveRoles.push({ id: change.roleId, name: change.roleName });
        }
      } else {
        // Remove
        effectiveRoles = effectiveRoles.filter(r => r.id !== change.roleId);
      }
    });
    
    return effectiveRoles;
  };

  // Get available roles for the dropdown (exclude already assigned)
  const availableRoles = (roles || []).filter(role => {
    const effectiveRoles = getEffectiveRoles();
    return !effectiveRoles.find(r => r.id === role.id);
  });

  // Check if a role is pending add/remove
  const getRoleStatus = (roleId: string): 'current' | 'pending-add' | 'pending-remove' => {
    const change = roleChanges.find(c => c.roleId === roleId);
    if (change) {
      return change.action === 'add' ? 'pending-add' : 'pending-remove';
    }
    return 'current';
  };

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={handleBack}
          className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          Back to users
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-600 dark:text-yellow-400">User not found</p>
        <button
          onClick={handleBack}
          className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 hover:underline"
        >
          Back to users
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Users</span>
        </button>
        
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Edit User
          </button>
        )}
      </div>

      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Mobile View */}
        {isMobile ? (
          <div className="p-6">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <UserAvatar
                name={user.name}
                image={user.image}
                size="xl"
              />
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user.name || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <p className="text-gray-900 dark:text-white">{user.email}</p>
                {isEditing && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image URL
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white text-sm break-all">
                    {user.image || 'N/A'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Roles
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {getEffectiveRoles().map((role: { id: string; name: string }) => {
                    const status = getRoleStatus(role.id);
                    return (
                      <span
                        key={role.id}
                        className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full ${
                          status === 'pending-add'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700'
                            : status === 'pending-remove'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700 line-through'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                        }`}
                      >
                        {role.name}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(role.id, role.name)}
                            disabled={isSaving}
                            className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            ✕
                          </button>
                        )}
                      </span>
                    );
                  })}
                  {getEffectiveRoles().length === 0 && (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">No roles assigned</span>
                  )}
                </div>
                
                {isEditing && availableRoles.length > 0 && (
                  <div className="flex gap-2">
                    <select
                      value={selectedRoleId}
                      onChange={(e) => setSelectedRoleId(e.target.value)}
                      disabled={isSaving}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a role to add...</option>
                      {availableRoles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddRole}
                      disabled={!selectedRoleId || isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      <FaPlus />
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                >
                  <FaSave />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                >
                  <FaTimes />
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Desktop View */
          <div className="p-8">
            <div className="flex gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <UserAvatar
                  name={user.name}
                  image={user.image}
                  size="xl"
                />
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">{user.name || 'N/A'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <p className="text-gray-900 dark:text-white py-2">{user.email}</p>
                    {isEditing && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image URL
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white py-2 text-sm break-all">
                      {user.image || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Roles
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getEffectiveRoles().map((role: { id: string; name: string }) => {
                      const status = getRoleStatus(role.id);
                      return (
                        <span
                          key={role.id}
                          className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full ${
                            status === 'pending-add'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700'
                              : status === 'pending-remove'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700 line-through'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          }`}
                        >
                          {role.name}
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRole(role.id, role.name)}
                              disabled={isSaving}
                              className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              ✕
                            </button>
                          )}
                        </span>
                      );
                    })}
                    {getEffectiveRoles().length === 0 && (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">No roles assigned</span>
                    )}
                  </div>
                  
                  {isEditing && availableRoles.length > 0 && (
                    <div className="flex gap-2">
                      <select
                        value={selectedRoleId}
                        onChange={(e) => setSelectedRoleId(e.target.value)}
                        disabled={isSaving}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a role to add...</option>
                        {availableRoles.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddRole}
                        disabled={!selectedRoleId || isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                      >
                        <FaPlus />
                        Add
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                    >
                      <FaSave />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                    >
                      <FaTimes />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
