'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminApi } from '../../_providers';
import { useMobileDetection } from '@/src/hooks';
import { UserAvatar } from '@/src/components';
import type { User } from '../../_providers/AdminApiProvider';
import type { UserDetailProps, UserFormData } from './UserDetail.types';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';

export function UserDetail({ userId, className = '' }: UserDetailProps) {
  const router = useRouter();
  const { fetchUser, updateUser, isLoading, error } = useAdminApi();
  const { isMobile } = useMobileDetection();
  
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    image: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUser(userId);
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          image: userData.image || '',
        });
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };
    
    loadUser();
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
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const updatedUser = await updateUser(userId, {
        name: formData.name,
        image: formData.image,
        updatedAt: user.updatedAt,
      });
      setUser(updatedUser);
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        image: updatedUser.image || '',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsSaving(false);
    }
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
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role: { id: string; name: string }) => (
                    <span
                      key={role.id}
                      className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                    >
                      {role.name}
                    </span>
                  ))}
                  {user.roles.length === 0 && (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">No roles assigned</span>
                  )}
                </div>
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
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role: { id: string; name: string }) => (
                      <span
                        key={role.id}
                        className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full"
                      >
                        {role.name}
                      </span>
                    ))}
                    {user.roles.length === 0 && (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">No roles assigned</span>
                    )}
                  </div>
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
