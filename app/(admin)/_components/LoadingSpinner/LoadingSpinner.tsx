'use client';

import { LoadingSpinnerProps } from './LoadingSpinner.types';

/**
 * Loading Spinner Component
 * Reusable loading indicator with optional message
 * Supports different sizes and full-screen mode
 */
export function LoadingSpinner({ 
  size = 'md', 
  message = 'Loading...', 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const paddingClasses = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-8',
  };

  const content = (
    <div className="text-center">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600 mx-auto mb-4`}></div>
      {message && (
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`${paddingClasses[size]} flex items-center justify-center min-h-screen`}>
        {content}
      </div>
    );
  }

  return content;
}
