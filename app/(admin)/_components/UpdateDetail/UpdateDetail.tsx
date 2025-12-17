'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminApi, useNotifications } from '../../_providers';
import { UpdateForm, LoadingSpinner, ErrorMessage } from '../../_components';
import type { Update } from '../../_providers/AdminApiProvider';
import type { UpdateFormData } from '../UpdateForm';
import type { UpdateDetailProps } from './UpdateDetail.types';

export function UpdateDetail({ updateId, returnUrl = '/admin/updates', className = '' }: UpdateDetailProps) {
  const router = useRouter();
  const { fetchUpdate, updateUpdate, deleteUpdate } = useAdminApi();
  const { success, error: showError } = useNotifications();

  const [update, setUpdate] = useState<Update | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadUpdate();
  }, [updateId]);

  const loadUpdate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchUpdate(updateId);
      setUpdate(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load update');
      console.error('Failed to load update:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateFormData) => {
    if (!update) return;

    setIsSubmitting(true);

    try {
      const updatedUpdate = await updateUpdate(updateId, {
        title: data.title,
        description: data.description,
        content: data.content,
        type: data.type,
        status: data.status,
        featured: data.featured,
        tags: data.tags,
        eventDate: data.eventDate || undefined,
        expiresAt: data.expiresAt || undefined,
        updatedAt: update.updatedAt,
      });

      setUpdate(updatedUpdate);
      success('Update saved successfully');
    } catch (err: any) {
      showError(err?.message || 'Failed to save update');
      console.error('Failed to save update:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(returnUrl);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!update) return;

    try {
      await deleteUpdate(updateId, update.updatedAt);
      success('Update deleted successfully');
      router.push(returnUrl);
    } catch (err: any) {
      showError(err?.message || 'Failed to delete update');
      console.error('Failed to delete update:', err);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  if (isLoading) {
    return (
      <div className={className}>
        <LoadingSpinner message="Loading update..." />
      </div>
    );
  }

  if (error || !update) {
    return (
      <div className={className}>
        <ErrorMessage message={error || 'Update not found'} />
        <button
          onClick={loadUpdate}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Metadata */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Created:</span>
          <span className="text-gray-900 dark:text-white">
            {new Date(update.createdAt).toLocaleString()} by {update.author ? update.author.name : 'Unknown'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
          <span className="text-gray-900 dark:text-white">
            {new Date(update.updatedAt).toLocaleString()}
          </span>
        </div>
        {update.publishedAt && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Published:</span>
            <span className="text-gray-900 dark:text-white">
              {new Date(update.publishedAt).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Form */}
      <UpdateForm
        mode="edit"
        initialData={update}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />

      {/* Delete Button */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleDeleteClick}
          className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          Delete Update
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Update
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete &quot;{update.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
