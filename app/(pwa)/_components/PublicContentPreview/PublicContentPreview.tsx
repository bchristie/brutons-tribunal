'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useApi } from '@/src/providers/GlobalProviders/GlobalProviders';
import { UpdateType } from '@prisma/client';
import type { PublicContentPreviewProps } from './PublicContentPreview.types';
import type { UpdateWithAuthor } from '@/src/lib/prisma/types/update.types';

function getUpdateTypeDisplay(type: UpdateType): string {
  const typeMap = {
    [UpdateType.CASE_STUDY]: 'Case Study',
    [UpdateType.DISCUSSION]: 'Discussion',
    [UpdateType.EVENT]: 'Event',
    [UpdateType.NEWS]: 'News',
    [UpdateType.ANNOUNCEMENT]: 'Announcement'
  };
  return typeMap[type] || type;
}

export function PublicContentPreview({ className = '' }: PublicContentPreviewProps) {
  const { getUpdates } = useApi();
  const [updates, setUpdates] = useState<UpdateWithAuthor[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUpdates() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getUpdates({ 
          featured: true, 
          limit: 3, 
          includeAuthor: true 
        });
        
        if (response.success && response.data) {
          setUpdates(response.data);
        } else {
          setError(response.error || 'Failed to fetch updates');
          setUpdates(null);
        }
      } catch (err) {
        console.error('Failed to fetch updates:', err);
        setError('Failed to load updates');
        setUpdates(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUpdates();
  }, [getUpdates]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className={`px-4 pb-4 ${className}`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Latest Updates
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Use real data if available, otherwise fall back to static content
  const contentToShow: UpdateWithAuthor[] = updates || [];
  
  return (
    <div className={`px-4 pb-12 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Latest Updates
      </h3>
      
      {error && (
        <div className="text-center py-4 mb-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Unable to load latest updates.
          </p>
        </div>
      )}
      
      {contentToShow.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No updates available yet.</p>
          <Link 
            href="/pwa/join" 
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
          >
            Sign in to contribute content →
          </Link>
        </div>
      )}
      
      {contentToShow.length > 0 && (
        <div className="space-y-4">
          {contentToShow.map((item: UpdateWithAuthor) => {
            const linkHref = item.linkHref || '/pwa/join';
            const linkText = item.linkText || 'Sign in to read more →';
            const updateType = getUpdateTypeDisplay(item.type);
            
            return (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </h4>
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                    {updateType}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {item.description}
                </p>
                {item.author && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                    By {item.author.name || 'Anonymous'} • {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                  </p>
                )}
                <Link 
                  href={linkHref}
                  className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                >
                  {linkText}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}