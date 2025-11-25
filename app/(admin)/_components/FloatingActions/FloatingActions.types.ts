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
}

// Breakpoint indicator
export interface BreakpointIndicatorProps {
  show?: boolean;
}

// Scroll to top
export interface ScrollToTopProps {
  threshold?: number | string; // number for pixels, string for vh/vw
  className?: string;
}
