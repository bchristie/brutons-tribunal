'use client';

import React, { useState } from 'react';
import { useAuth } from '@/src/providers/AuthProvider';
import type { AuthIndicatorProps } from './FloatingActions.types';

export function AuthIndicator({ show = true }: AuthIndicatorProps) {
  const { user, isLoading, isAuthenticated, mode, signIn, signOut } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  if (!show) return null;

  const getAuthStyles = () => {
    if (isLoading) {
      return { 
        backgroundColor: '#6b7280', 
        color: 'white',
        cursor: 'default'
      };
    }
    if (isAuthenticated) {
      return { 
        backgroundColor: '#22c55e', 
        color: 'white',
        cursor: 'pointer'
      };
    }
    return { 
      backgroundColor: '#ef4444', 
      color: 'white',
      cursor: 'pointer'
    };
  };

  const getAuthIcon = () => {
    if (isLoading) return '⏳';
    if (isAuthenticated) return '👤';
    return '🔐';
  };

  const getTooltipContent = () => {
    if (isLoading) {
      return 'Loading auth status...';
    }
    if (isAuthenticated) {
      // Show user info if available, otherwise show session info
      if (user) {
        return `Signed in as ${user.name || user.email}\nMode: ${mode}\nClick to sign out`;
      } else {
        return `Signed in (user data loading...)\nMode: ${mode}\nClick to sign out`;
      }
    }
    return `Not signed in\nMode: ${mode}\nClick to sign in with Google`;
  };

  const handleClick = async () => {
    if (isLoading) return;
    
    if (isAuthenticated) {
      await signOut();
    } else {
      await signIn();
    }
  };

  return (
    <div className="relative">
      <button
        style={getAuthStyles()}
        className={`
          floating-action-button
          inline-flex items-center justify-center
          w-12 h-12 rounded-full
          text-lg
          shadow-lg border-2 border-white
          transition-all duration-200
          hover:scale-105
          ${isLoading ? 'opacity-50' : 'hover:shadow-xl'}
        `}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isLoading}
        aria-label={isAuthenticated ? 'Sign out' : 'Sign in with Google'}
      >
        {getAuthIcon()}
      </button>

      {/* Detailed tooltip on hover - positioned to the right to avoid overlaps */}
      {isHovered && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-pre-line z-50 min-w-48">
          {getTooltipContent()}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-900"></div>
        </div>
      )}
    </div>
  );
}