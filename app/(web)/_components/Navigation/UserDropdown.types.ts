import type { ReactNode } from 'react';

export interface UserDropdownProps {
  variant?: 'overlay' | 'solid' | 'auto';
  className?: string;
}

export interface UserDropdownState {
  isAuthenticated: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    initials?: string;
  };
}

export interface UserMenuItemProps {
  icon?: ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}