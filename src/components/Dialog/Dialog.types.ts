import { ReactNode } from 'react';

export interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export interface MobileDrawerProps extends BaseDialogProps {
  /** Height of the drawer as a percentage of viewport height */
  height?: string;
  /** Show handle bar at top of drawer */
  showHandle?: boolean;
}

export interface DesktopModalProps extends BaseDialogProps {
  /** Title displayed in modal header */
  title?: string;
  /** Maximum width of modal */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export interface ResponsiveDialogProps extends BaseDialogProps {
  /** Title for desktop modal (optional) */
  title?: string;
  /** Max width for desktop modal */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Height for mobile drawer */
  drawerHeight?: string;
}
