import { ReactNode } from 'react';

export interface PWAState {
  isMobileDevice: boolean;
  supportsPWAInstallation: boolean;
  isAppInstalled: boolean;
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
}

export interface PWAActions {
  registerServiceWorker: () => Promise<ServiceWorkerRegistration | null>;
  checkInstallationStatus: () => boolean;
  refreshPWAState: () => void;
}

export interface GlobalContextState extends PWAState, PWAActions {
  isInitialized: boolean;
  userAgent: string;
}

export interface GlobalProvidersProps {
  children: ReactNode;
  initialUserAgent?: string;
}