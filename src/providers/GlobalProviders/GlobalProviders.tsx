'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  isMobileDevice as checkIsMobileDevice, 
  supportsPWAInstallation as checkSupportsPWAInstallation,
  isAppInstalled as checkIsAppInstalled,
  registerServiceWorker as registerSW
} from '@/src/lib';
import { GlobalContextState, GlobalProvidersProps } from './GlobalProviders.types';
import { apiMethods } from './api.functions';

// Create the context
const GlobalContext = createContext<GlobalContextState | undefined>(undefined);

// Hook to use the context
export function useGlobal() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProviders');
  }
  return context;
}

// Hook specifically for API functionality
export function useApi() {
  const context = useGlobal();
  return context.api;
}

// Hook specifically for PWA functionality
export function usePWA() {
  const context = useGlobal();
  return {
    isMobileDevice: context.isMobileDevice,
    supportsPWAInstallation: context.supportsPWAInstallation,
    isAppInstalled: context.isAppInstalled,
    serviceWorkerRegistration: context.serviceWorkerRegistration,
    registerServiceWorker: context.registerServiceWorker,
    checkInstallationStatus: context.checkInstallationStatus,
    refreshPWAState: context.refreshPWAState,
  };
}

// Main provider component
export default function GlobalProviders({ 
  children, 
  initialUserAgent 
}: GlobalProvidersProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [userAgent, setUserAgent] = useState(initialUserAgent || '');
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [supportsPWAInstallation, setSupportsPWAInstallation] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Register service worker
  const registerServiceWorker = useCallback(async (): Promise<ServiceWorkerRegistration | null> => {
    try {
      const registration = await registerSW();
      setServiceWorkerRegistration(registration);
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return null;
    }
  }, []);

  // Check installation status
  const checkInstallationStatus = useCallback((): boolean => {
    const installed = checkIsAppInstalled();
    setIsAppInstalled(installed);
    return installed;
  }, []);

  // Refresh all PWA state
  const refreshPWAState = useCallback(() => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : userAgent;
    setUserAgent(ua);
    setIsMobileDevice(checkIsMobileDevice(ua));
    setSupportsPWAInstallation(checkSupportsPWAInstallation());
    checkInstallationStatus();
  }, [userAgent, checkInstallationStatus]);

  // Initialize on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initial setup
      refreshPWAState();
      
      // Register service worker automatically
      registerServiceWorker();

      // Listen for app installation
      const handleAppInstalled = () => {
        setIsAppInstalled(true);
      };

      // Listen for display mode changes
      const handleDisplayModeChange = () => {
        checkInstallationStatus();
      };

      window.addEventListener('appinstalled', handleAppInstalled);
      
      // Listen for display mode changes (when user installs/uninstalls)
      if (window.matchMedia) {
        const displayModeMediaQuery = window.matchMedia('(display-mode: standalone)');
        displayModeMediaQuery.addEventListener('change', handleDisplayModeChange);

        // Cleanup
        return () => {
          window.removeEventListener('appinstalled', handleAppInstalled);
          displayModeMediaQuery.removeEventListener('change', handleDisplayModeChange);
        };
      }

      setIsInitialized(true);
    }
  }, [registerServiceWorker, checkInstallationStatus, refreshPWAState]);

  // Context value
  const contextValue: GlobalContextState = {
    // State
    isInitialized,
    userAgent,
    isMobileDevice,
    supportsPWAInstallation,
    isAppInstalled,
    serviceWorkerRegistration,
    
    // Actions
    registerServiceWorker,
    checkInstallationStatus,
    refreshPWAState,
    
    // API
    api: apiMethods,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}