'use client';

import { useAppInfo } from '@/src/lib/hooks/useAppInfo';
import { 
  FloatingActionContainer, 
  BreakpointIndicator, 
  ScrollToTop 
} from '../FloatingActions';

interface FloatingActionsProps {
  showBreakpointIndicator?: boolean;
  showScrollToTop?: boolean;
  scrollThreshold?: number | string;
}

export function FloatingActions({
  showBreakpointIndicator = process.env.NODE_ENV === 'development',
  showScrollToTop = true,
  scrollThreshold = 400
}: FloatingActionsProps) {
  const { isMobileDevice } = useAppInfo();

  if (isMobileDevice) {
    // Don't show floating actions on mobile devices
    return null;
  }

  return (
    <FloatingActionContainer 
      position="bottom-right"
    >
      {showScrollToTop && (
        <ScrollToTop threshold={scrollThreshold} />
      )}
      
      {showBreakpointIndicator && (
        <BreakpointIndicator />
      )}
    </FloatingActionContainer>
  );
}