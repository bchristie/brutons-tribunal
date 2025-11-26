'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { PageHeaderContextValue, PageHeaderProviderProps, PageHeaderConfig } from './PageHeaderProvider.types';

const PageHeaderContext = createContext<PageHeaderContextValue | undefined>(undefined);

export function usePageHeader() {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error('usePageHeader must be used within PageHeaderProvider');
  }
  return context;
}

export function PageHeaderProvider({ children }: PageHeaderProviderProps) {
  const [config, setConfig] = useState<PageHeaderConfig | null>(null);

  return (
    <PageHeaderContext.Provider value={{ config, setConfig }}>
      {children}
    </PageHeaderContext.Provider>
  );
}

/**
 * Hook to set page header configuration
 * Call this in your page component to set header content
 */
export function useSetPageHeader(config: PageHeaderConfig | null) {
  const { setConfig } = usePageHeader();

  useEffect(() => {
    setConfig(config);
    
    // Cleanup on unmount
    return () => setConfig(null);
  }, [config, setConfig]);
}
