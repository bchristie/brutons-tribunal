import { ReactNode } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  mobileLabel?: string; // Shorter label for mobile
}

export interface PageHeaderConfig {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  mobileTitle?: string; // Simplified title for mobile breadcrumb
  actions?: PageAction[];
}

export interface PageHeaderContextValue {
  config: PageHeaderConfig | null;
  setConfig: (config: PageHeaderConfig | null) => void;
}

export interface PageHeaderProviderProps {
  children: ReactNode;
}
