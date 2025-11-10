'use client';

import { useState, useEffect } from 'react';
import { usePWA } from '@/src/providers';
import { 
  BeforeInstallPromptEvent, 
  PWAInstallPromptProps, 
  InstallState 
} from './PWAInstallPrompt.types';

export default function PWAInstallPrompt({ 
  className = '', 
  onInstall, 
  onInstallDecline 
}: PWAInstallPromptProps) {
  const { isAppInstalled } = usePWA();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installState, setInstallState] = useState<InstallState>('not-installable');

  useEffect(() => {
    // Check if already installed using context
    if (isAppInstalled) {
      setInstallState('installed');
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setInstallState('installable');
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setInstallState('installed');
      setDeferredPrompt(null);
      onInstall?.();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [onInstall, isAppInstalled]); // Add isAppInstalled dependency

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      onInstall?.();
    } else {
      console.log('User dismissed the install prompt');
      onInstallDecline?.();
    }
    
    setDeferredPrompt(null);
    setInstallState('not-installable');
  };

  const baseClasses = 'border rounded-lg p-4 text-center';

  if (installState === 'installed') {
    return (
      <div className={`${baseClasses} bg-green-50 border-green-200 ${className}`}>
        <div className="text-green-800 font-medium">✅ App Installed!</div>
        <div className="text-green-600 text-sm mt-1">
          You can find the app on your home screen
        </div>
      </div>
    );
  }

  if (installState === 'installable') {
    return (
      <div className={`${baseClasses} bg-blue-50 border-blue-200 ${className}`}>
        <div className="text-blue-800 font-medium mb-2">📱 Install App</div>
        <button 
          onClick={handleInstallClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Add to Home Screen
        </button>
        <div className="text-blue-600 text-xs mt-2">
          Get the full app experience with offline support!
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} bg-gray-50 border-gray-200 ${className}`}>
      <div className="text-gray-600 text-sm">
        💡 To install this app:
      </div>
      <div className="text-gray-500 text-xs mt-1">
        Open browser menu → "Add to Home Screen" or "Install App"
      </div>
    </div>
  );
}