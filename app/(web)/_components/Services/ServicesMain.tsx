'use client';

import { createContext, useContext } from 'react';
import type { ServicesProps, ServicesContextType } from './Services.types';

// Create context for Services components
const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

// Hook for accessing Services context
export function useServices(): ServicesContextType {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('Services compound components must be used within a Services component');
  }
  return context;
}

export function ServicesMain({ 
  children, 
  variant = 'default',
  className = '',
  backgroundColor = 'primary'
}: ServicesProps) {
  const backgroundClasses = {
    primary: 'bg-theme-primary',
    secondary: 'bg-theme-secondary',
    transparent: ''
  };

  return (
    <ServicesContext.Provider value={{ variant }}>
      <section className={`py-16 ${backgroundClasses[backgroundColor]} ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </section>
    </ServicesContext.Provider>
  );
}