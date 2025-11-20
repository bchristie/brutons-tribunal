'use client';

import { useAuth } from '@/src/providers/AuthProvider';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { data: session } = useSession();
  
  // Get roles from session instead of user object
  const userRoles = (session?.user as any)?.roles || [];

  const getUserInitials = (name: string | null): string => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const profileSections = [
    {
      title: 'Account Information',
      items: [
        { label: 'Name', value: user?.name || 'Not provided' },
        { label: 'Email', value: user?.email || 'Not provided' },
        { label: 'Roles', value: userRoles.join(', ') || 'None assigned' },
        { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown' },
      ]
    },
    {
      title: 'Activity',
      items: [
        { label: 'Discussions participated', value: '12' },
        { label: 'Events attended', value: '8' },
        { label: 'Articles read', value: '24' },
      ]
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            {user?.image ? (
              <img 
                src={user.image} 
                alt={user.name || 'User avatar'}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-blue-600 dark:text-blue-300">
                {getUserInitials(user?.name || null)}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {user?.name || 'User'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Profile Information */}
      {profileSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {section.title}
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="p-4 flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {item.label}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="space-y-3">
        {/*<button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
          Edit Profile
        </button>*/}
        
        <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors">
          Privacy Settings
        </button>
        
        <button 
          onClick={() => signOut('/pwa')}
          className="w-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}