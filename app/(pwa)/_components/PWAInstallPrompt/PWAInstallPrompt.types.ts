export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAInstallPromptProps {
  className?: string;
  onInstall?: () => void;
  onInstallDecline?: () => void;
}

export type InstallState = 'not-installable' | 'installable' | 'installed';