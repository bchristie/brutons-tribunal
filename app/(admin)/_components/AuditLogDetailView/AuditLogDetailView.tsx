'use client';

import type { AuditLogDetailViewProps } from './AuditLogDetailView.types';

export function AuditLogDetailView({ auditLog, onClose }: AuditLogDetailViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
  };

  const formatUserName = (name: string | null | undefined, email: string | undefined): string => {
    if (name && email) return `${name} (${email})`;
    return email || name || 'Unknown';
  };

  const getActionBadgeColor = (action: string): string => {
    if (action.includes('DELETE')) return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300';
    if (action.includes('CREATE')) return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
    if (action.includes('UPDATE') || action.includes('CHANGE')) return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
    if (action.includes('LOGIN')) return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
    if (action.includes('DEPLOYMENT')) return 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300';
    return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with close button */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getActionBadgeColor(auditLog.action)}`}>
              {auditLog.action.replace(/_/g, ' ')}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {auditLog.entityType}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatDate(auditLog.createdAt)}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Actor Information */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Performed By</h4>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <p className="text-sm text-gray-900 dark:text-white font-medium">
            {formatUserName(auditLog.performedBy.name, auditLog.performedBy.email)}
          </p>
          {auditLog.ipAddress && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              IP: {auditLog.ipAddress}
            </p>
          )}
        </div>
      </div>

      {/* Target User (if applicable) */}
      {auditLog.user && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Target User</h4>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <p className="text-sm text-gray-900 dark:text-white">
              {formatUserName(auditLog.user.name, auditLog.user.email)}
            </p>
          </div>
        </div>
      )}

      {/* Entity Details */}
      {auditLog.entityId && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Entity ID</h4>
          <p className="text-xs font-mono bg-gray-50 dark:bg-gray-900 rounded px-3 py-2 text-gray-700 dark:text-gray-300 break-all">
            {auditLog.entityId}
          </p>
        </div>
      )}

      {/* Metadata */}
      {auditLog.metadata && Object.keys(auditLog.metadata).length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Additional Details</h4>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 space-y-2">
            {Object.entries(auditLog.metadata).map(([key, value]) => (
              <div key={key}>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <p className="text-sm text-gray-900 dark:text-white mt-0.5">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Log ID */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Audit Log ID</h4>
        <p className="text-xs font-mono bg-gray-50 dark:bg-gray-900 rounded px-3 py-2 text-gray-700 dark:text-gray-300 break-all">
          {auditLog.id}
        </p>
      </div>
    </div>
  );
}
