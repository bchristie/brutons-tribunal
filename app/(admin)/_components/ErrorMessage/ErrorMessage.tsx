'use client';

import { ErrorMessageProps } from './ErrorMessage.types';

/**
 * Error Message Component
 * Reusable error display with consistent styling
 */
export function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div className={`p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg ${className}`}>
      <p className="text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
}
