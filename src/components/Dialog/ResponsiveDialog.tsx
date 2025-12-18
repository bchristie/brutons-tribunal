'use client';

import { useMobileDetection } from '@/src/hooks';
import { MobileDrawer } from './MobileDrawer';
import { DesktopModal } from './DesktopModal';
import type { ResponsiveDialogProps } from './Dialog.types';

export function ResponsiveDialog({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = 'lg',
  drawerHeight = '75vh',
  bottomOffset = 0,
  className = '',
}: ResponsiveDialogProps) {
  const { isMobile } = useMobileDetection();

  if (isMobile) {
    return (
      <MobileDrawer
        isOpen={isOpen}
        onClose={onClose}
        height={drawerHeight}
        bottomOffset={bottomOffset}
        className={className}
      >
        {children}
      </MobileDrawer>
    );
  }

  return (
    <DesktopModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      className={className}
    >
      {children}
    </DesktopModal>
  );
}
