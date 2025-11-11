'use client';

import React from 'react';
import { 
  FloatingActionContainer, 
  BreakpointIndicator, 
  ThemeToggle, 
  ScrollToTop 
} from '../FloatingActions';

interface FloatingActionsProps {
  showBreakpointIndicator?: boolean;
  showThemeToggle?: boolean;
  showScrollToTop?: boolean;
  scrollThreshold?: number | string;
}

export function FloatingActions({
  showBreakpointIndicator = process.env.NODE_ENV === 'development',
  showThemeToggle = true,
  showScrollToTop = true,
  scrollThreshold = 400
}: FloatingActionsProps) {
  return (
    <FloatingActionContainer 
      position="bottom-left"
      hideWhenMobileMenuOpen={true}
    >
      {showScrollToTop && (
        <ScrollToTop threshold={scrollThreshold} />
      )}
      
      {showThemeToggle && (
        <ThemeToggle />
      )}
      
      {showBreakpointIndicator && (
        <BreakpointIndicator />
      )}
    </FloatingActionContainer>
  );
}