'use client';

import type { HeroScrollIndicatorProps } from './Hero.types';

export function HeroScrollIndicator({ 
  target = 'auto',
  offset = 80,
  variant = 'arrow',
  position = 'center',
  className = '',
  onClick
}: HeroScrollIndicatorProps) {
  
  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    let targetElement;
    
    if (target === 'auto') {
      // Auto-find the next main content section
      targetElement = document.querySelector('main') || 
                     document.querySelector('[data-hero-target]') ||
                     document.querySelector('section:not([data-hero])');
    } else {
      targetElement = document.querySelector(target);
    }

    if (targetElement) {
      const elementPosition = (targetElement as HTMLElement).offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Convert position to CSS classes
  const getPositionClass = (pos: string) => {
    switch (pos) {
      case 'left': return 'left-8';
      case 'right': return 'right-8';
      case 'center':
      default: return 'left-1/2 transform -translate-x-1/2';
    }
  };

  // Get icon based on variant
  const renderIcon = () => {
    switch (variant) {
      case 'chevron':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        );
      case 'dots':
        return (
          <div className="flex flex-col space-y-1">
            <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
          </div>
        );
      case 'arrow':
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        );
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        absolute bottom-8 ${getPositionClass(position)}
        text-white hover:text-gray-300 transition-colors duration-200
        animate-bounce cursor-pointer z-20
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent
        rounded-full p-2
        ${className}
      `}
      aria-label="Scroll to content"
    >
      {renderIcon()}
    </button>
  );
}