'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function useMobileDetection() {
  const pathname = usePathname();

  const detectedMode = useMemo(() => {
    // Check if we're in PWA context based on pathname
    if (pathname?.startsWith('/pwa')) {
      return 'pwa' as const;
    }
    
    // For now, default to desktop in web context
    // In the future, this could use user agent detection
    return 'desktop' as const;
  }, [pathname]);

  return {
    detectedMode,
    isMobile: detectedMode === 'pwa', // PWA implies mobile for now
    isPWA: detectedMode === 'pwa',
    isDesktop: detectedMode === 'desktop',
  };
}