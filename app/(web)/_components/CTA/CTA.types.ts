import type { ReactNode } from 'react';

// Context type for CTA components
export interface CTAContextType {
  variant: 'primary' | 'secondary';
  maxWidth: string;
}

// Main CTA Container Props
export interface CTAProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

// CTA Title Props
export interface CTATitleProps {
  children: ReactNode;
  className?: string;
}

// CTA Body Props
export interface CTABodyProps {
  children: ReactNode;
  className?: string;
}

// CTA Actions Container Props
export interface CTAActionsProps {
  children: ReactNode;
  className?: string;
  layout?: 'horizontal' | 'vertical';
  gap?: 'sm' | 'md' | 'lg';
}

// CTA Button Props
export interface CTAButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

// CTA Text Props (for additional text in actions)
export interface CTATextProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}