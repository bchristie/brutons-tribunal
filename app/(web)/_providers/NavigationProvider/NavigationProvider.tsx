'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { NavigationContextType, NavigationProviderProps, ThemeMode } from './NavigationProvider.types';

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setThemeState] = useState<ThemeMode>('auto');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  // Close menu on route changes (we'll add this when we have routing)
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    // Add event listener for route changes when Next.js router is available
    // For now, just close on escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Determine effective theme
  useEffect(() => {
    const updateEffectiveTheme = () => {
      if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setEffectiveTheme(prefersDark ? 'dark' : 'light');
      } else {
        setEffectiveTheme(theme);
      }
    };

    updateEffectiveTheme();

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateEffectiveTheme);
      return () => mediaQuery.removeEventListener('change', updateEffectiveTheme);
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    console.log('Theme applied:', effectiveTheme, 'from mode:', theme);
  }, [effectiveTheme, theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    // Persist theme preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-preference', newTheme);
    }
  };

  // Load theme preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme-preference') as ThemeMode;
      if (saved && ['auto', 'light', 'dark'].includes(saved)) {
        setThemeState(saved);
      }
    }
  }, []);

  const value: NavigationContextType = {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    openMenu,
    theme,
    setTheme,
    effectiveTheme,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}