'use client';

import React, { createContext, useContext } from 'react';
import type { CTAProps, CTAContextType } from './CTA.types';

// Create context for CTA components
const CTAContext = createContext<CTAContextType | undefined>(undefined);

// Hook for accessing CTA context
export function useCTA(): CTAContextType {
  const context = useContext(CTAContext);
  if (context === undefined) {
    throw new Error('CTA compound components must be used within a CTA component');
  }
  return context;
}

export function CTAMain({
  children,
  variant = 'primary',
  className = '',
  maxWidth = '3xl'
}: CTAProps) {
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  };

  const variantStyles = {
    primary: {
      sectionStyle: { backgroundColor: 'var(--color-primary-600)', color: 'white' },
      sectionClassName: '',
    },
    secondary: {
      sectionStyle: undefined,
      sectionClassName: 'bg-theme-secondary text-theme-primary',
    }
  };

  const currentVariant = variantStyles[variant];
  const maxWidthClass = maxWidthClasses[maxWidth];

  return (
    <CTAContext.Provider value={{ variant, maxWidth: maxWidthClass }}>
      <section 
        className={`py-16 ${currentVariant.sectionClassName} ${className}`}
        style={currentVariant.sectionStyle}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {children}
        </div>
      </section>
    </CTAContext.Provider>
  );
}

export { CTAContext };