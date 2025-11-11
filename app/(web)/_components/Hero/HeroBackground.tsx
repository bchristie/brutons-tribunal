'use client';

import { useEffect } from 'react';
import { useHero } from './Hero';
import type { HeroBackgroundProps } from './Hero.types';

export function HeroBackground({ 
  src,
  alt = 'Hero background',
  overlay = 0.4,
  position = 'center',
  className = '',
  style = {}
}: HeroBackgroundProps) {
  const { setBackgroundSet } = useHero();

  // Register that a background is set
  useEffect(() => {
    setBackgroundSet(true);
    return () => setBackgroundSet(false);
  }, [setBackgroundSet]);

  // Convert overlay prop to CSS
  const getOverlayClass = (overlayValue: number | string) => {
    switch (overlayValue) {
      case 'light': return 'bg-white/20';
      case 'dark': return 'bg-black/40';
      case 'none': return '';
      case 0: return '';
      default: 
        if (typeof overlayValue === 'number') {
          return `bg-black/${Math.round(overlayValue * 100)}`;
        }
        return 'bg-black/40';
    }
  };

  // Convert position to CSS classes
  const getPositionClass = (pos: string) => {
    switch (pos) {
      case 'top': return 'bg-top';
      case 'bottom': return 'bg-bottom';
      case 'left': return 'bg-left';
      case 'right': return 'bg-right';
      case 'center':
      default: return 'bg-center';
    }
  };

  if (!src) return null;

  return (
    <>
      {/* Background Image */}
      <div 
        className={`
          absolute inset-0 bg-cover bg-no-repeat
          ${getPositionClass(position)}
          ${className}
        `}
        style={{ 
          backgroundImage: `url(${src})`,
          ...style 
        }}
        role="img"
        aria-label={alt}
      />
      
      {/* Overlay */}
      {overlay !== 'none' && overlay !== 0 && (
        <div className={`absolute inset-0 ${getOverlayClass(overlay)}`} />
      )}
    </>
  );
}