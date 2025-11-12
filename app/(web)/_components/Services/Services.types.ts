import type { ReactNode } from 'react';

// Context type for Services components
export interface ServicesContextType {
  variant: 'default' | 'centered' | 'compact';
}

// Main Services Container Props
export interface ServicesProps {
  children: ReactNode;
  variant?: 'default' | 'centered' | 'compact';
  className?: string;
  backgroundColor?: 'primary' | 'secondary' | 'transparent';
}

// Services Title Props
export interface ServicesTitleProps {
  children: ReactNode;
  className?: string;
}

// Services Body Props
export interface ServicesBodyProps {
  children: ReactNode;
  className?: string;
}

// Services Items Container Props
export interface ServicesItemsProps {
  children: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

// Individual Services Item Props
export interface ServicesItemProps {
  children: ReactNode;
  title: string;
  icon?: ReactNode | string;
  className?: string;
}