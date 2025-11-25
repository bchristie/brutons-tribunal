'use client';

import React, { useEffect, useState } from 'react';
import type { BreakpointIndicatorProps } from './FloatingActions.types';

// Tailwind breakpoint definitions
const breakpoints = {
  'xs': 0,     // < 640px
  'sm': 640,   // >= 640px
  'md': 768,   // >= 768px
  'lg': 1024,  // >= 1024px
  'xl': 1280,  // >= 1280px
  '2xl': 1536  // >= 1536px
} as const;

function getCurrentBreakpoint(width: number): keyof typeof breakpoints {
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

export function BreakpointIndicator({ show = true }: BreakpointIndicatorProps) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<keyof typeof breakpoints>('xs');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setCurrentBreakpoint(getCurrentBreakpoint(width));
    };

    // Set initial value
    updateBreakpoint();

    // Listen for resize events
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  if (!isClient || !show) return null;

  const getBreakpointStyles = (breakpoint: keyof typeof breakpoints) => {
    const styles = {
      'xs': { backgroundColor: '#ef4444', color: 'white' },
      'sm': { backgroundColor: '#f97316', color: 'white' },
      'md': { backgroundColor: '#eab308', color: '#1f2937' },
      'lg': { backgroundColor: '#22c55e', color: 'white' },
      'xl': { backgroundColor: '#3b82f6', color: 'white' },
      '2xl': { backgroundColor: '#8b5cf6', color: 'white' },
    };
    return styles[breakpoint];
  };

  return (
    <div
      style={getBreakpointStyles(currentBreakpoint)}
      className={`
        floating-action-button
        inline-flex items-center justify-center
        w-12 h-12 rounded-full
        text-xs font-mono font-bold
        shadow-lg border-2 border-white
        transition-colors duration-200
      `}
      title={`Current breakpoint: ${currentBreakpoint} (${window.innerWidth}px)`}
      role="status"
      aria-live="polite"
      aria-label={`Current screen breakpoint is ${currentBreakpoint}`}
    >
      {currentBreakpoint.toUpperCase()}
    </div>
  );
}