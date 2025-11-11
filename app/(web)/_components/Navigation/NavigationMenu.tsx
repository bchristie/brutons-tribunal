'use client';

import Link from 'next/link';
import { useScroll } from '@/app/(web)/_providers';
import type { NavigationMenuProps } from './Navigation.types';

export function NavigationMenu({ 
  items, 
  variant = 'auto',
  className = '' 
}: NavigationMenuProps) {
  const { headerVariant } = useScroll();
  const currentVariant = variant === 'auto' ? headerVariant : variant;
  
  const isOverlay = currentVariant === 'overlay';

  return (
    <nav className={`hidden md:flex items-center space-x-8 ${className}`}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            flex items-center space-x-2 transition-all duration-300
            ${isOverlay 
              ? 'text-white hover:text-gray-200' 
              : 'text-theme-primary hover:text-primary-600'
            }
            font-medium text-sm lg:text-base
          `}
        >
          {item.icon && (
            <span className="w-4 h-4 flex-shrink-0">
              {item.icon}
            </span>
          )}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}