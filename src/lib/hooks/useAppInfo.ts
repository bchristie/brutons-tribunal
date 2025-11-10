// Example usage hook - you can delete this or move it to your actual hooks directory
'use client';

import { usePWA } from '@/src/providers';

/**
 * Example custom hook that combines PWA state for page-level logic
 * You can move this to a dedicated hooks directory if needed
 */
export function useAppInfo() {
  const { 
    isMobileDevice, 
    isAppInstalled, 
    supportsPWAInstallation 
  } = usePWA();

  const appType = isAppInstalled 
    ? 'pwa' 
    : isMobileDevice 
      ? 'mobile-web' 
      : 'desktop-web';

  const showInstallPrompt = isMobileDevice && 
    supportsPWAInstallation && 
    !isAppInstalled;

  return {
    appType,
    isMobileDevice,
    isAppInstalled,
    supportsPWAInstallation,
    showInstallPrompt,
  };
}