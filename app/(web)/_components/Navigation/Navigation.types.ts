import type { ReactNode } from 'react';

export interface NavigationItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

export interface NavigationHeaderProps {
  logoScale?: 'normal' | 'small';
  variant?: 'overlay' | 'solid' | 'auto';
  menuItems?: NavigationItem[];
  showUserDropdown?: boolean;
}

export interface NavigationLogoProps {
  scale?: 'normal' | 'small';
  variant?: 'overlay' | 'solid' | 'auto';
}

export interface NavigationMenuProps {
  items: NavigationItem[];
  variant?: 'overlay' | 'solid' | 'auto';
  className?: string;
}

export interface MobileMenuToggleProps {
  variant?: 'overlay' | 'solid' | 'auto';
}

export interface MobileMenuDrawerProps {
  items: NavigationItem[];
  isOpen: boolean;
  onClose: () => void;
}