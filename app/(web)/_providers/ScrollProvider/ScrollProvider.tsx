'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ScrollContextType, ScrollProviderProps } from './ScrollProvider.types';

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ 
  children, 
  scrollThreshold = 100 
}: ScrollProviderProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > scrollThreshold);
    };

    // Set initial scroll position
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollThreshold]);

  const headerVariant = isScrolled ? 'solid' : 'overlay';

  const value: ScrollContextType = {
    scrollY,
    isScrolled,
    headerVariant,
  };

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll(): ScrollContextType {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
}