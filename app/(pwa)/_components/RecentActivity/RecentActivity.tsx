'use client';

import { useEffect, useState } from 'react';
import { MobileDrawer } from '@/src/components';
import { UpdateDetailView, type Update } from '../UpdateDetailView';

interface RecentActivityProps {
  limit?: number;
  className?: string;
}

export function RecentActivity({ limit = 5, className = '' }: RecentActivityProps) {
  const [recentActivity, setRecentActivity] = useState<Update[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Update | null>(null);

  // Fetch recent activity from public updates API
  useEffect(() => {
    async function fetchActivity() {
      try {
        const response = await fetch(`/api/pwa/activity?limit=${limit}`);
        if (response.ok) {
          const data = await response.json();
          const activities: Update[] = data.updates.map((update: any) => ({
            id: update.id,
            title: update.title,
            description: update.description,
            content: update.content,
            type: update.type,
            time: new Date(update.publishedAt).toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
              month: 'short',
              day: 'numeric',
            }),
            icon: getIconForType(update.type),
            featured: update.featured || false,
            author: update.author?.name || 'Unknown',
            tags: update.tags || [],
            linkHref: update.linkHref,
            linkText: update.linkText,
          }));
          setRecentActivity(activities);
        }
      } catch (error) {
        console.error('Failed to fetch activity:', error);
      } finally {
        setIsLoadingActivity(false);
      }
    }

    fetchActivity();
  }, [limit]);

  // Get icon based on update type
  const getIconForType = (type: string): React.ReactNode => {
    switch (type) {
      case 'EVENT':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'DISCUSSION':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'NEWS':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        );
      case 'CASE_STUDY':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={className}>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
        {isLoadingActivity ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recent activity
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Check back soon for updates and announcements
            </p>
          </div>
        ) : (
          recentActivity.map((activity, index) => (
            <button
              key={index}
              onClick={() => setSelectedActivity(activity)}
              className="w-full p-4 flex items-start space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                activity.featured
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm text-gray-900 dark:text-white ${
                  activity.featured ? 'font-bold' : 'font-medium'
                }`}>
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Detail Drawer */}
      <MobileDrawer
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
        height="75vh"
      >
        {selectedActivity && (
          <UpdateDetailView
            update={selectedActivity}
            onClose={() => setSelectedActivity(null)}
          />
        )}
      </MobileDrawer>
    </div>
  );
}
