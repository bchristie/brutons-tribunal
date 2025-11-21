'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';

export function useMobileDetection() {
  const pathname = usePathname();
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);
  const [userAgent, setUserAgent] = useState<string>('');

  // Track window width for viewport-based detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial values
    setWindowWidth(window.innerWidth);
    setUserAgent(navigator.userAgent);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const detectedMode = useMemo(() => {
    // Check if we're in PWA context based on pathname
    if (pathname?.startsWith('/pwa')) {
      return 'pwa' as const;
    }

    // Server-side or initial render - default to desktop
    if (windowWidth === undefined) {
      return 'desktop' as const;
    }

    // Check viewport width (tablets and below)
    const isNarrowViewport = windowWidth < 768; // tailwind's md breakpoint

    // Check user agent for mobile devices
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileUA = mobileRegex.test(userAgent);

    // Consider it mobile if either viewport is narrow OR user agent indicates mobile
    if (isNarrowViewport || isMobileUA) {
      return 'mobile' as const;
    }
    
    return 'desktop' as const;
  }, [pathname, windowWidth, userAgent]);

  return {
    detectedMode,
    isMobile: detectedMode === 'pwa' || detectedMode === 'mobile',
    isPWA: detectedMode === 'pwa',
    isDesktop: detectedMode === 'desktop',
    windowWidth,
  };
}