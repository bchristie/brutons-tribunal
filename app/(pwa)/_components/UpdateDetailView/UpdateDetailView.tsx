'use client';

import { Markdown } from '@/src/components';
import type { UpdateDetailViewProps } from './UpdateDetailView.types';

export function UpdateDetailView({ update, onClose }: UpdateDetailViewProps) {
  return (
    <div className="p-6 pb-20 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
          update.featured
            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }`}>
          {update.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-xl text-gray-900 dark:text-white mb-1 ${
            update.featured ? 'font-bold' : 'font-semibold'
          }`}>
            {update.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{update.time}</span>
            <span>•</span>
            <span>{update.author}</span>
          </div>
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

      {/* Description */}
      {update.description && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {update.description}
          </p>
        </div>
      )}

      {/* Tags */}
      {update.tags && update.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {update.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content - Scrollable */}
      {update.content && (
        <div className="flex-1 overflow-y-auto">
          <Markdown>{update.content}</Markdown>
        </div>
      )}

      {/* Action Button */}
      {update.linkHref && (
        <div className="pt-4">
          <a
            href={update.linkHref}
            className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium rounded-lg transition-colors"
          >
            {update.linkText || 'Learn More'}
          </a>
        </div>
      )}
    </div>
  );
}
