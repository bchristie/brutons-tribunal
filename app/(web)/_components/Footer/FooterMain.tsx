'use client';

import { createContext, useContext } from 'react';
import type { FooterProps, FooterContextType } from './Footer.types';

// Create context for Footer components
const FooterContext = createContext<FooterContextType | undefined>(undefined);

// Hook for accessing Footer context
export function useFooter(): FooterContextType {
  const context = useContext(FooterContext);
  if (context === undefined) {
    throw new Error('Footer compound components must be used within a Footer component');
  }
  return context;
}

export function FooterMain({ 
  children, 
  className = '',
  totalColumns = 12,
  backgroundColor = 'dark'
}: FooterProps) {
  const backgroundClasses = {
    primary: 'bg-theme-primary',
    secondary: 'bg-theme-secondary', 
    dark: 'bg-gray-900'
  };

  const textClasses = {
    primary: 'text-theme-primary',
    secondary: 'text-theme-secondary',
    dark: 'text-white'
  };

  const mutedTextClasses = {
    primary: 'text-theme-secondary',
    secondary: 'text-theme-primary opacity-75',
    dark: 'text-gray-400'
  };

  const gridClasses = {
    12: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-12',
    8: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-8',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6'
  };

  return (
    <FooterContext.Provider value={{ totalColumns }}>
      <footer className={`${backgroundClasses[backgroundColor]} ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Content Grid */}
          <div className={`grid ${gridClasses[totalColumns]} gap-8 mb-8`}>
            {children}
          </div>

          {/* Footer Bottom - Branding and Copyright */}
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              {/* <h3 className={`text-2xl font-bold ${textClasses[backgroundColor]}`}>
                Bruton's Tribunal
              </h3> */}
              <p className={`${mutedTextClasses[backgroundColor]} text-sm`}>
                Professional Legal Services Since 1985
              </p>
            </div>
            <div className={`${mutedTextClasses[backgroundColor]} text-sm`}>
              <p>&copy; {new Date().getFullYear()} Bruton's Tribunal. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </FooterContext.Provider>
  );
}