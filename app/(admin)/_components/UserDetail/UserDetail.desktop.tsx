'use client';

import { UserAvatar } from '@/src/components';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorMessage } from '../ErrorMessage';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useUserForm } from './useUserForm';
import type { UserDetailProps } from './UserDetail.types';

export function UserDetailDesktop({ userId, returnUrl, className = '' }: UserDetailProps) {
  const {
    user,
    formData,
    isLoading,
    isSaving,
    error,
    isDirty,
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
  } = useUserForm(userId, returnUrl);

  if (isLoading && !user && !isCreateMode) {
    return <LoadingSpinner size="md" message="Loading user..." />;
  }

  if (error && !user && !isCreateMode) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className={className}>
      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-8">
          <div className="flex gap-8">
            {/* Avatar */}
            {!isCreateMode && (
              <div className="flex-shrink-0">
                <UserAvatar
                  name={formData.name}
                  image={formData.image}
                  size="xl"
                />
              </div>
            )}

            {/* Form Fields */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name {isCreateMode && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="Enter name"
                    disabled={isSaving}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email {isCreateMode && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="Enter email"
                    disabled={isSaving || !isCreateMode}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  />
                  {!isCreateMode && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Email cannot be changed
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => handleFieldChange('image', e.target.value)}
                  placeholder="https://..."
                  disabled={isSaving}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Roles
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 max-h-48 overflow-y-auto bg-white dark:bg-gray-900">
                  {roles && roles.length > 0 ? (
                    <div className="space-y-2">
                      {roles.map(role => {
                        const checked = hasRole(role.id);
                        const pending = isPending(role.id);
                        const currentlyHas = user?.roles.some(r => r.id === role.id) || false;
                        
                        return (
                          <label
                            key={role.id}
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                              pending ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleToggleRole(role.id, role.name, currentlyHas)}
                              disabled={isSaving}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="flex-1 text-sm text-gray-900 dark:text-white">
                              {role.name}
                              {pending && (
                                <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">
                                  (pending)
                                </span>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No roles available</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !isDirty}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <FaSave />
                  {isSaving ? 'Saving...' : isCreateMode ? 'Create User' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <FaTimes />
                  Cancel
                </button>
                {!isCreateMode && !isSelf && (
                  <button
                    onClick={handleDelete}
                    disabled={isSaving}
                    className="px-6 py-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                  >
                    Delete User
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
