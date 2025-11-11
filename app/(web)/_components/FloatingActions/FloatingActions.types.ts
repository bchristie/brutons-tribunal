import type { ReactNode } from 'react';

// Base FAB component interface
export interface FloatingActionButtonProps {
  onClick?: () => void;
  icon: ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isVisible?: boolean;
  className?: string;
}

// Container for managing FAB layout
export interface FloatingActionContainerProps {
  children: ReactNode;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
  hideWhenMobileMenuOpen?: boolean;
}

// Breakpoint indicator
export interface BreakpointIndicatorProps {
  show?: boolean;
}

// Theme toggle
export type ThemeMode = 'auto' | 'light' | 'dark';

export interface ThemeToggleProps {
  className?: string;
}

export interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  effectiveTheme: 'light' | 'dark'; // The actual theme being applied
}

// Scroll to top
export interface ScrollToTopProps {
  threshold?: number | string; // number for pixels, string for vh/vw
  className?: string;
}

// Enhanced navigation context (extends existing)
export interface EnhancedNavigationContextType {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
  // Theme management
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  effectiveTheme: 'light' | 'dark';
}