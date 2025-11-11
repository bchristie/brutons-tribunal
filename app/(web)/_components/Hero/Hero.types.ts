import type { ReactNode, CSSProperties } from 'react';

// Main Hero Container
export interface HeroProps {
  children: ReactNode;
  height?: string | 'screen' | '75vh' | '50vh';
  className?: string;
}

// Hero Background
export interface HeroBackgroundProps {
  src?: string;
  alt?: string;
  overlay?: number | 'light' | 'dark' | 'none';
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  style?: CSSProperties;
}

// Hero Content Wrapper
export interface HeroContentProps {
  children: ReactNode;
  layout?: 'single' | 'two-column' | 'three-column';
  alignment?: 'center' | 'left' | 'right' | 'justify';
  gap?: 'none' | 'small' | 'medium' | 'large' | 'xl';
  maxWidth?: string;
  className?: string;
}

// Individual Hero Columns
export interface HeroColumnProps {
  children: ReactNode;
  width?: 'auto' | 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';
  alignment?: 'center' | 'left' | 'right' | 'top' | 'middle' | 'bottom';
  className?: string;
}

// Hero Scroll Indicator
export interface HeroScrollIndicatorProps {
  target?: string; // CSS selector or 'auto'
  offset?: number;
  variant?: 'arrow' | 'chevron' | 'dots';
  position?: 'center' | 'left' | 'right';
  className?: string;
  onClick?: () => void;
}

// Hero Context (for internal component communication)
export interface HeroContextType {
  height: string;
  backgroundSet: boolean;
  setBackgroundSet: (value: boolean) => void;
}