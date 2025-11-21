'use client';

import React from 'react';
import { UserAvatarProps, RoleStyle } from './UserAvatar.types';
import { Roles } from '@/src/lib/permissions/permissions';

// Role priority for determining which badge to show
const ROLE_PRIORITY: Record<string, number> = {
  [Roles.ADMIN]: 3,
  [Roles.EDITOR]: 2,
  [Roles.VIEWER]: 1,
};

// Role styling configuration
const ROLE_STYLES: Record<string, RoleStyle> = {
  [Roles.ADMIN]: { bg: 'bg-red-500', text: 'text-white', label: 'A' },
  [Roles.EDITOR]: { bg: 'bg-blue-500', text: 'text-white', label: 'E' },
  [Roles.VIEWER]: { bg: 'bg-gray-500', text: 'text-white', label: 'V' },
};

// Size configuration
const SIZE_CLASSES = {
  xs: {
    container: 'w-6 h-6',
    text: 'text-xs',
    badge: 'w-3 h-3 text-[8px]',
    badgeOffset: '-bottom-0.5 -right-0.5',
  },
  sm: {
    container: 'w-8 h-8',
    text: 'text-sm',
    badge: 'w-4 h-4 text-[10px]',
    badgeOffset: '-bottom-0.5 -right-0.5',
  },
  md: {
    container: 'w-10 h-10',
    text: 'text-base',
    badge: 'w-5 h-5 text-xs',
    badgeOffset: '-bottom-1 -right-1',
  },
  lg: {
    container: 'w-14 h-14',
    text: 'text-lg',
    badge: 'w-6 h-6 text-sm',
    badgeOffset: '-bottom-1 -right-1',
  },
  xl: {
    container: 'w-24 h-24',
    text: 'text-2xl',
    badge: 'w-8 h-8 text-base',
    badgeOffset: '-bottom-2 -right-2',
  },
};

export default function UserAvatar({
  name,
  email,
  image,
  roles = [],
  size = 'md',
  showBadge = true,
  onClick,
  className = '',
}: UserAvatarProps) {
  // Get user initials for fallback
  const getUserInitials = (): string => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  // Determine highest priority role
  const getHighestRole = (): string | null => {
    if (!roles || roles.length === 0) return null;

    return roles.reduce((highest, role) => {
      const currentPriority = ROLE_PRIORITY[role] || 0;
      const highestPriority = ROLE_PRIORITY[highest] || 0;
      return currentPriority > highestPriority ? role : highest;
    }, roles[0]);
  };

  const highestRole = getHighestRole();
  const roleStyle = highestRole ? ROLE_STYLES[highestRole] : null;
  const sizeConfig = SIZE_CLASSES[size];

  return (
    <div
      className={`relative inline-block ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Avatar Container */}
      <div
        className={`
          ${sizeConfig.container}
          rounded-full
          overflow-hidden
          flex items-center justify-center
          ${image ? '' : 'bg-blue-100 dark:bg-blue-900'}
          ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        `}
      >
        {image ? (
          <img
            src={image}
            alt={name || email || 'User avatar'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className={`
              ${sizeConfig.text}
              font-semibold
              text-blue-600 dark:text-blue-300
            `}
          >
            {getUserInitials()}
          </span>
        )}
      </div>

      {/* Role Badge */}
      {showBadge && roleStyle && (
        <div
          className={`
            absolute
            ${sizeConfig.badgeOffset}
            ${sizeConfig.badge}
            ${roleStyle.bg}
            ${roleStyle.text}
            rounded-full
            flex items-center justify-center
            font-bold
            border-2 border-white dark:border-gray-800
            shadow-sm
          `}
          title={`Role: ${highestRole}`}
        >
          {roleStyle.label}
        </div>
      )}
    </div>
  );
}
