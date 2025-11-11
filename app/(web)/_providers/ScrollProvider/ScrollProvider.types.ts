export interface ScrollContextType {
  scrollY: number;
  isScrolled: boolean;
  headerVariant: 'overlay' | 'solid';
}

export interface ScrollProviderProps {
  children: React.ReactNode;
  scrollThreshold?: number;
}