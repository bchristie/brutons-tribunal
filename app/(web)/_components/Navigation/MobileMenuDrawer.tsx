'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import type { MobileMenuDrawerProps } from './Navigation.types';

export function MobileMenuDrawer({ 
  items, 
  isOpen, 
  onClose 
}: MobileMenuDrawerProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 max-w-[80vw] bg-theme-primary 
          z-50 md:hidden transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col shadow-xl
        `}
        aria-hidden={!isOpen}
      >
        {/* Fixed Logo Area */}
        <div className="flex items-center justify-between p-6 border-b border-theme-primary">
          <Link 
            href="/"
            onClick={onClose}
            className="text-xl font-bold text-theme-primary"
          >
            Bruton's Tribunal
          </Link>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="space-y-2 px-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="
                  flex items-center space-x-3 p-3 rounded-lg
                  text-theme-primary
                  hover:bg-theme-secondary
                  transition-colors duration-200
                  text-base font-medium
                "
              >
                {item.icon && (
                  <span className="w-5 h-5 flex-shrink-0">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Fixed Bottom Action Area */}
        <div className="p-6 border-t border-theme-primary bg-theme-secondary">
          {/* Placeholder for user actions - we'll enhance this later */}
          <div className="space-y-3">
            <button
              type="button"
              className="
                w-full p-3 text-left rounded-lg
                text-gray-600 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-700
                transition-colors duration-200
                text-sm
              "
            >
              Settings
            </button>
            <button
              type="button"
              className="
                w-full p-3 text-left rounded-lg
                text-red-600 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-900/20
                transition-colors duration-200
                text-sm font-medium
              "
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}