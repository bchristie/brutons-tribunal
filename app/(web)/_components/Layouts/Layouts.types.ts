import type { ReactNode } from 'react';
import type { NavigationItem } from '@/app/(web)/_components/Navigation/Navigation.types';

export interface BaseLayoutProps {
  children: ReactNode;
  menuItems?: NavigationItem[];
}

export interface HeroLayoutProps extends BaseLayoutProps {
  heroImage?: string;
  heroContent?: ReactNode;
  heroHeight?: string;
}

export interface StandardLayoutProps extends BaseLayoutProps {
  title?: string;
  description?: string;
}