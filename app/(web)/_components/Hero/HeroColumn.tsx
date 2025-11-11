'use client';

import type { HeroColumnProps } from './Hero.types';

export function HeroColumn({ 
  children,
  width = 'auto',
  alignment = 'center',
  className = ''
}: HeroColumnProps) {
  
  // Convert width to CSS classes
  const getWidthClass = (w: string) => {
    switch (w) {
      case 'full': return 'w-full';
      case '1/2': return 'w-1/2';
      case '1/3': return 'w-1/3';
      case '2/3': return 'w-2/3';
      case '1/4': return 'w-1/4';
      case '3/4': return 'w-3/4';
      case 'auto':
      default: return 'w-auto';
    }
  };

  // Convert alignment to CSS flexbox classes
  const getAlignmentClass = (align: string) => {
    const baseClasses = 'flex flex-col';
    
    switch (align) {
      case 'left': return `${baseClasses} items-start text-left`;
      case 'right': return `${baseClasses} items-end text-right`;
      case 'top': return `${baseClasses} justify-start items-center text-center`;
      case 'bottom': return `${baseClasses} justify-end items-center text-center`;
      case 'middle': return `${baseClasses} justify-center items-center text-center`;
      case 'center':
      default: return `${baseClasses} justify-center items-center text-center`;
    }
  };

  return (
    <div className={`
      ${getWidthClass(width)}
      ${getAlignmentClass(alignment)}
      ${className}
    `}>
      {children}
    </div>
  );
}