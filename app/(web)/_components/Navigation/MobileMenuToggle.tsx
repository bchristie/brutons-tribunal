'use client';

import { useNavigation, useScroll } from '@/app/(web)/_providers';
import type { MobileMenuToggleProps } from './Navigation.types';

export function MobileMenuToggle({ variant = 'auto' }: MobileMenuToggleProps) {
  const { isMenuOpen, toggleMenu } = useNavigation();
  const { headerVariant } = useScroll();
  const currentVariant = variant === 'auto' ? headerVariant : variant;
  
  const isOverlay = currentVariant === 'overlay';

  return (
    <button
      onClick={toggleMenu}
      className={`
        md:hidden flex flex-col justify-center items-center
        w-8 h-8 relative transition-all duration-300
        ${isOverlay ? 'text-white' : 'text-gray-900 dark:text-gray-100'}
        hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isOverlay ? 'focus:ring-white' : 'focus:ring-blue-500'}
      `}
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isMenuOpen}
    >
      <div className="w-6 h-4 relative">
        {/* Top line */}
        <span className={`
          absolute left-0 top-0 w-6 h-0.5 bg-current transition-all duration-300
          ${isMenuOpen ? 'rotate-45 top-1.5' : ''}
        `} />
        
        {/* Middle line */}
        <span className={`
          absolute left-0 top-1.5 w-6 h-0.5 bg-current transition-all duration-300
          ${isMenuOpen ? 'opacity-0' : 'opacity-100'}
        `} />
        
        {/* Bottom line */}
        <span className={`
          absolute left-0 top-3 w-6 h-0.5 bg-current transition-all duration-300
          ${isMenuOpen ? '-rotate-45 top-1.5' : ''}
        `} />
      </div>
    </button>
  );
}