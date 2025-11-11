export type ThemeMode = 'auto' | 'light' | 'dark';

export interface NavigationContextType {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
  // Theme management
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  effectiveTheme: 'light' | 'dark';
}

export interface NavigationProviderProps {
  children: React.ReactNode;
}