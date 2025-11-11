'use client';

import React, { useEffect, useState } from 'react';
import { useNavigation } from '../../_providers/NavigationProvider';
import type { FloatingActionContainerProps } from './FloatingActions.types';

export function FloatingActionContainer({ 
  children, 
  position = 'bottom-left',
  className = '',
  hideWhenMobileMenuOpen = true 
}: FloatingActionContainerProps) {
  const { isMenuOpen } = useNavigation();
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side only rendering to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Hide when mobile menu is open if requested
  if (hideWhenMobileMenuOpen && isMenuOpen) {
    return null;
  }

  const positionClasses = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
  };

  return (
    <div 
      className={`
        fixed z-50 flex flex-col-reverse gap-3
        ${positionClasses[position]}
        ${className}
      `}
      role="group"
      aria-label="Floating Action Buttons"
    >
      {children}
    </div>
  );
}