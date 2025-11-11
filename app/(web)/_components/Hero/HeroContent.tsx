'use client';

import type { HeroContentProps } from './Hero.types';

export function HeroContent({ 
  children,
  layout = 'single',
  alignment = 'center',
  gap = 'medium',
  maxWidth = '7xl',
  className = ''
}: HeroContentProps) {
  
  // Convert layout to CSS grid classes
  const getLayoutClass = (layoutType: string) => {
    switch (layoutType) {
      case 'two-column': return 'grid md:grid-cols-2';
      case 'three-column': return 'grid md:grid-cols-2 lg:grid-cols-3';
      case 'single':
      default: return 'flex flex-col';
    }
  };

  // Convert alignment to CSS classes
  const getAlignmentClass = (align: string, layoutType: string) => {
    if (layoutType === 'single') {
      switch (align) {
        case 'left': return 'items-start text-left';
        case 'right': return 'items-end text-right';
        case 'center':
        default: return 'items-center text-center';
      }
    } else {
      switch (align) {
        case 'left': return 'items-start';
        case 'right': return 'items-end';
        case 'justify': return 'items-stretch';
        case 'center':
        default: return 'items-center';
      }
    }
  };

  // Convert gap to CSS classes
  const getGapClass = (gapSize: string) => {
    switch (gapSize) {
      case 'none': return 'gap-0';
      case 'small': return 'gap-4';
      case 'medium': return 'gap-8';
      case 'large': return 'gap-12';
      case 'xl': return 'gap-16';
      default: return 'gap-8';
    }
  };

  // Convert maxWidth to CSS classes
  const getMaxWidthClass = (width: string) => {
    switch (width) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      case '3xl': return 'max-w-3xl';
      case '4xl': return 'max-w-4xl';
      case '5xl': return 'max-w-5xl';
      case '6xl': return 'max-w-6xl';
      case '7xl': return 'max-w-7xl';
      case 'full': return 'max-w-full';
      case 'none': return '';
      default: return width.startsWith('max-w-') ? width : `max-w-${width}`;
    }
  };

  return (
    <div className={`relative z-10 w-full px-4 sm:px-6 lg:px-8 ${getMaxWidthClass(maxWidth)} mx-auto`}>
      <div className={`
        ${getLayoutClass(layout)}
        ${getAlignmentClass(alignment, layout)}
        ${getGapClass(gap)}
        w-full
        ${className}
      `}>
        {children}
      </div>
    </div>
  );
}