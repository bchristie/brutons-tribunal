'use client';

import { useEffect, useState } from 'react';
import type { FloatingActionContainerProps } from './FloatingActions.types';

export function FloatingActionContainer({ 
  children, 
  position = 'bottom-left',
  className = ''
}: FloatingActionContainerProps) {
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side only rendering to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

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