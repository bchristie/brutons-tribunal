'use client';

import { useMobileDetection } from '@/src/hooks';
import { UserDetailMobile } from './UserDetail.mobile';
import { UserDetailDesktop } from './UserDetail.desktop';
import type { UserDetailProps } from './UserDetail.types';

export function UserDetail({ userId, returnUrl, className = '' }: UserDetailProps) {
  const { isMobile } = useMobileDetection();

  if (isMobile) {
    return <UserDetailMobile userId={userId} returnUrl={returnUrl} className={className} />;
  }

  return <UserDetailDesktop userId={userId} returnUrl={returnUrl} className={className} />;
}