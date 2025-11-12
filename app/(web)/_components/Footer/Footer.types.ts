import type { ReactNode } from 'react';

// Context type for Footer components
export interface FooterContextType {
  totalColumns: number;
}

// Main Footer Container Props
export interface FooterProps {
  children: ReactNode;
  className?: string;
  totalColumns?: 12 | 8 | 6;
  backgroundColor?: 'primary' | 'secondary' | 'dark';
}

// Footer Section Props
export interface FooterSectionProps {
  children: ReactNode;
  title?: string;
  width?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  className?: string;
}