'use client';

import { useState } from 'react';
import { useMobileDetection } from '@/src/hooks/useMobileDetection';
import { ResponsiveDialog } from '@/src/components';
import { AuditLogDetailView, type AuditLog } from '../AuditLogDetailView';
import { RecentActivityProps } from './RecentActivity.types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

/**
 * Recent Activity Component
 * Displays activity log with device-specific layouts
 * Mobile: Timeline view with dots and compact info
 * Desktop: Table view with full details and status badges
 */
export function RecentActivity({ 
  activities, 
  page = 1, 
  totalPages = 1,
  onPageChange 
}: RecentActivityProps) {
  const { isMobile } = useMobileDetection();
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const handleActivityClick = async (activityId: string) => {
    setIsLoadingDetail(true);
    try {
      const response = await fetch(`/api/admin/audit-logs/${activityId}`);
      if (response.ok) {
        const auditLog = await response.json();
        setSelectedAuditLog(auditLog);
      } else {
        console.error('Failed to fetch audit log details');
      }
    } catch (error) {
      console.error('Error fetching audit log:', error);
    } finally {
      setIsLoadingDetail(false);
    }
  };
  
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  const statusColorClasses = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };

  const dotColorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500',
  };

  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => canGoPrev && onPageChange?.(page - 1)}
                disabled={!canGoPrev}
                className={`p-1.5 rounded ${
                  canGoPrev
                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                }`}
                aria-label="Previous page"
              >
                <FaChevronLeft className="w-3 h-3" />
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => canGoNext && onPageChange?.(page + 1)}
                disabled={!canGoNext}
                className={`p-1.5 rounded ${
                  canGoNext
                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                }`}
                aria-label="Next page"
              >
                <FaChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
          {activities.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No recent activity
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Activity will appear here as actions are performed
              </p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <button
                key={index}
                onClick={() => activity.id && handleActivityClick(activity.id)}
                className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isLoadingDetail}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 ${dotColorClasses[activity.statusColor || 'gray']} rounded-full mt-2`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.event}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => canGoPrev && onPageChange?.(page - 1)}
              disabled={!canGoPrev}
              className={`p-2 rounded ${
                canGoPrev
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              }`}
              aria-label="Previous page"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[4rem] text-center">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => canGoNext && onPageChange?.(page + 1)}
              disabled={!canGoNext}
              className={`p-2 rounded ${
                canGoNext
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              }`}
              aria-label="Next page"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-3">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-base text-gray-500 dark:text-gray-400 font-medium">
              No recent activity
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Activity will appear here as actions are performed
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {activities.map((activity, index) => (
                <tr
                  key={index}
                  onClick={() => activity.id && handleActivityClick(activity.id)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 ${dotColorClasses[activity.statusColor || 'gray']} rounded-full mt-1.5`}></div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {activity.event}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          On {activity.time}{activity.user ? ` by ${activity.user}` : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {activity.status && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorClasses[activity.statusColor || 'gray']}`}>
                        {activity.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Dialog */}
      <ResponsiveDialog
        isOpen={!!selectedAuditLog}
        onClose={() => setSelectedAuditLog(null)}
        title="Audit Log Details"
        maxWidth="lg"
      >
        {selectedAuditLog && (
          <AuditLogDetailView
            auditLog={selectedAuditLog}
            onClose={() => setSelectedAuditLog(null)}
          />
        )}
      </ResponsiveDialog>
    </div>
  );
}
