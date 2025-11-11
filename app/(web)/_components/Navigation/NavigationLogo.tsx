'use client';

import Link from 'next/link';
import { useScroll } from '@/app/(web)/_providers';
import type { NavigationLogoProps } from './Navigation.types';

export function NavigationLogo({ 
  scale = 'normal', 
  variant = 'auto' 
}: NavigationLogoProps) {
  const { headerVariant } = useScroll();
  const currentVariant = variant === 'auto' ? headerVariant : variant;
  
  const isOverlay = currentVariant === 'overlay';
  const isSmall = scale === 'small';

  return (
    <Link 
      href="/"
      className={`
        flex items-center transition-all duration-300
        ${isSmall ? 'text-lg' : 'text-xl md:text-2xl'}
        ${isOverlay ? 'text-white' : 'text-gray-900 dark:text-gray-100'}
        hover:opacity-80
      `}
    >
      <div className={`
        font-bold tracking-tight
        ${isSmall ? 'text-base md:text-lg' : 'text-lg md:text-xl'}
      `}>
        Bruton's Tribunal
      </div>
    </Link>
  );
}