export interface NavigationContextType {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
}

export interface NavigationProviderProps {
  children: React.ReactNode;
}