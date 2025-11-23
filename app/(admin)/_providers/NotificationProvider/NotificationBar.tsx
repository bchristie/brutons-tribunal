'use client';

import type { Notification } from './NotificationProvider.types';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

interface NotificationBarProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationBar({ notifications, onDismiss }: NotificationBarProps) {
  if (notifications.length === 0) return null;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="flex-shrink-0" />;
      case 'error':
        return <FaExclamationCircle className="flex-shrink-0" />;
      case 'warning':
        return <FaExclamationTriangle className="flex-shrink-0" />;
      case 'info':
        return <FaInfoCircle className="flex-shrink-0" />;
    }
  };

  const getStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300';
    }
  };

  return (
    <div className="fixed top-4 left-4 right-4 md:top-4 md:right-4 md:left-auto z-50 space-y-2 md:max-w-md md:w-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-4 border rounded-lg shadow-lg animate-slide-in ${getStyles(notification.type)}`}
        >
          <div className="mt-0.5">
            {getIcon(notification.type)}
          </div>
          <p className="flex-1 text-sm font-medium break-words">
            {notification.message}
          </p>
          <button
            onClick={() => onDismiss(notification.id)}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Dismiss notification"
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
}
