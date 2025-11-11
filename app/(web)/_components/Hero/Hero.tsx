'use client';

import React, { createContext, useContext, useState } from 'react';
import type { HeroProps, HeroContextType } from './Hero.types';

// Create context for Hero components
const HeroContext = createContext<HeroContextType | undefined>(undefined);

// Hook for accessing Hero context
export function useHero(): HeroContextType {
  const context = useContext(HeroContext);
  if (context === undefined) {
    throw new Error('Hero compound components must be used within a Hero component');
  }
  return context;
}

export function Hero({ 
  children, 
  height = 'screen',
  className = '' 
}: HeroProps) {
  const [backgroundSet, setBackgroundSet] = useState(false);

  // Convert height prop to CSS class
  const getHeightClass = (h: string) => {
    switch (h) {
      case 'screen': return 'h-screen';
      case '75vh': return 'h-[75vh]';
      case '50vh': return 'h-[50vh]';
      default: return h.startsWith('h-') ? h : `h-[${h}]`;
    }
  };

  const contextValue: HeroContextType = {
    height: getHeightClass(height),
    backgroundSet,
    setBackgroundSet,
  };

  return (
    <HeroContext.Provider value={contextValue}>
      <section 
        className={`
          relative ${getHeightClass(height)} 
          bg-gray-900 overflow-hidden
          ${className}
        `}
      >
        {children}
      </section>
    </HeroContext.Provider>
  );
}