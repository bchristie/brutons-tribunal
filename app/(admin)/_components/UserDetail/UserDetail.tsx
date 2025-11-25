'use client';

import { useMobileDetection } from '@/src/hooks';
import { UserDetailMobile } from './UserDetail.mobile';
import { UserDetailDesktop } from './UserDetail.desktop';
import type { UserDetailProps } from './UserDetail.types';

export function UserDetail({ userId, className = '' }: UserDetailProps) {
  const { isMobile } = useMobileDetection();

  if (isMobile) {
    return <UserDetailMobile userId={userId} className={className} />;
  }

  return <UserDetailDesktop userId={userId} className={className} />;
}