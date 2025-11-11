'use client';

import React from 'react';
import { useNavigation } from '../../_providers/NavigationProvider';
import type { ThemeToggleProps } from './FloatingActions.types';

// Icons for different theme states
const ThemeIcons = {
  auto: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path 
        d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m11.72 11.72l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42"
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  ),
  light: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
      <path 
        d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m11.72 11.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42"
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path 
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" 
        fill="currentColor"
      />
    </svg>
  )
};

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme, effectiveTheme } = useNavigation();

  const cycleTheme = () => {
    const cycle = {
      'auto': 'light',
      'light': 'dark', 
      'dark': 'auto'
    } as const;
    
    setTheme(cycle[theme]);
  };

  const getThemeLabel = () => {
    const nextTheme = {
      'auto': 'light',
      'light': 'dark', 
      'dark': 'auto'
    }[theme] as 'auto' | 'light' | 'dark';
    
    switch (nextTheme) {
      case 'auto':
        return `Switch to Auto (currently ${effectiveTheme})`;
      case 'light':
        return 'Switch to Light mode';
      case 'dark':
        return 'Switch to Dark mode';
      default:
        return 'Switch theme';
    }
  };

  const getThemeStyles = () => {
    // Show what mode we'll switch TO, not what we're currently in
    const nextTheme = {
      'auto': 'light',
      'light': 'dark', 
      'dark': 'auto'
    }[theme] as 'auto' | 'light' | 'dark';
    
    switch (nextTheme) {
      case 'auto':
        return {
          backgroundColor: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: 'white'
        };
      case 'light':
        return {
          backgroundColor: '#eab308',
          color: '#1f2937'
        };
      case 'dark':
        return {
          backgroundColor: '#1f2937',
          color: 'white'
        };
      default:
        return {
          backgroundColor: '#3b82f6',
          color: 'white'
        };
    }
  };

  const getNextThemeIcon = () => {
    const nextTheme = {
      'auto': 'light',
      'light': 'dark', 
      'dark': 'auto'
    }[theme] as 'auto' | 'light' | 'dark';
    
    return ThemeIcons[nextTheme];
  };

  const themeStyles = getThemeStyles();

  return (
    <button
      onClick={cycleTheme}
      style={themeStyles}
      className={`
        floating-action-button
        relative inline-flex items-center justify-center
        w-12 h-12 rounded-full
        shadow-lg border-2 border-white
        hover:scale-105 active:scale-95
        transition-all duration-200
        focus:outline-none focus:ring-4 focus:ring-blue-500/25
        ${className}
      `}
      title={`Current theme: ${theme}. ${getThemeLabel()}`}
      aria-label={getThemeLabel()}
    >
      {getNextThemeIcon()}
      
      {/* Status indicator for auto mode */}
      {theme === 'auto' && (
        <div 
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white"
          style={{
            backgroundColor: effectiveTheme === 'dark' ? '#1f2937' : '#eab308'
          }}
          aria-hidden="true"
        />
      )}
    </button>
  );
}