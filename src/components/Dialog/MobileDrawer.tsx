'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { MobileDrawerProps } from './Dialog.types';

export function MobileDrawer({
  isOpen,
  onClose,
  children,
  height = '75vh',
  showHandle = true,
  bottomOffset = 0,
  className = '',
}: MobileDrawerProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const drawerContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sliding Drawer */}
      <div
        className={`fixed inset-x-0 z-50 animate-slide-up ${className}`}
        style={{ bottom: `${bottomOffset}px` }}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl flex flex-col"
          style={{ height: bottomOffset > 0 ? `calc(${height} - ${bottomOffset}px)` : height }}
        >
          {/* Handle bar */}
          {showHandle && (
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                aria-label="Close drawer"
              />
            </div>
          )}

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );

  // Render drawer at document body level using portal
  return typeof document !== 'undefined' ? createPortal(drawerContent, document.body) : null;
}
