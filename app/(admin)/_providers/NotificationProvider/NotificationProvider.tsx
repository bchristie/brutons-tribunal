'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { NotificationContextValue, NotificationProviderProps, Notification, NotificationType } from './NotificationProvider.types';
import { NotificationBar } from './NotificationBar';

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((type: NotificationType, message: string, duration: number = 5000) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const notification: Notification = { id, type, message, duration };
    
    setNotifications(prev => [...prev, notification]);

    // Auto-dismiss if duration is set
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    showNotification('success', message, duration);
  }, [showNotification]);

  const error = useCallback((message: string, duration?: number) => {
    showNotification('error', message, duration);
  }, [showNotification]);

  const warning = useCallback((message: string, duration?: number) => {
    showNotification('warning', message, duration);
  }, [showNotification]);

  const info = useCallback((message: string, duration?: number) => {
    showNotification('info', message, duration);
  }, [showNotification]);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: NotificationContextValue = {
    notifications,
    showNotification,
    success,
    error,
    warning,
    info,
    dismiss,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      <NotificationBar notifications={notifications} onDismiss={dismiss} />
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
