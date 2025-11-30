'use client';

import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

/**
 * Reusable modal component using Headless UI
 * - Full screen on mobile
 * - Flexible sizing on desktop
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  const sizeClasses = {
    sm: 'md:max-w-sm',
    md: 'md:max-w-md',
    lg: 'md:max-w-lg',
    xl: 'md:max-w-xl',
    full: 'md:max-w-4xl',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center md:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`
                  w-full h-full md:h-auto
                  bg-white dark:bg-gray-800 
                  md:rounded-lg shadow-xl
                  transform transition-all
                  flex flex-col
                  ${sizeClasses[size]}
                `}
              >
                {/* Header */}
                <div className="flex items-start justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex-1">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {title}
                    </Dialog.Title>
                    {description && (
                      <Dialog.Description className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                  {showCloseButton && (
                    <button
                      type="button"
                      className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      onClick={onClose}
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
