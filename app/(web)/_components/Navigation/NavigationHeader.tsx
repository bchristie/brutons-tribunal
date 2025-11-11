'use client';

import { useNavigation, useScroll } from '@/app/(web)/_providers';
import { NavigationLogo } from './NavigationLogo';
import { NavigationMenu } from './NavigationMenu';
import { MobileMenuToggle } from './MobileMenuToggle';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { UserDropdown } from './UserDropdown';
import type { NavigationHeaderProps, NavigationItem } from './Navigation.types';

// Default navigation items
const defaultMenuItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

export function NavigationHeader({ 
  logoScale = 'normal',
  variant = 'auto',
  menuItems = defaultMenuItems,
  showUserDropdown = true
}: NavigationHeaderProps) {
  const { isMenuOpen, closeMenu } = useNavigation();
  const { headerVariant, isScrolled } = useScroll();
  
  const currentVariant = variant === 'auto' ? headerVariant : variant;
  const isOverlay = currentVariant === 'overlay';
  const logoVariant = variant === 'auto' ? 'auto' : variant;

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-30 transition-all duration-300
          ${isOverlay 
            ? 'bg-transparent' 
            : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm'
          }
          ${isScrolled ? 'transform translate-y-0' : ''}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <NavigationLogo 
              scale={logoScale} 
              variant={logoVariant}
            />

            {/* Center: Desktop Navigation */}
            <div className="flex-1 flex justify-center">
              <NavigationMenu 
                items={menuItems} 
                variant={currentVariant}
              />
            </div>

            {/* Right: User Dropdown & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {showUserDropdown && (
                <UserDropdown variant={currentVariant} />
              )}
              <MobileMenuToggle variant={currentVariant} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer
        items={menuItems}
        isOpen={isMenuOpen}
        onClose={closeMenu}
      />
    </>
  );
}