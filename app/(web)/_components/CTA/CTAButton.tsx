'use client';

import { useCTA } from './CTAMain';
import type { CTAButtonProps } from './CTA.types';

export function CTAButton({ 
  children, 
  href, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}: CTAButtonProps) {
  const ctaContext = useCTA();
  const baseClasses = 'inline-flex items-center justify-center border border-transparent rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  // Context-aware button styling based on CTA variant
  const getVariantClasses = () => {
    if (ctaContext.variant === 'primary') {
      // On primary (dark) backgrounds, use contrasting colors
      switch (variant) {
        case 'primary':
          return 'text-blue-600 bg-white hover:bg-gray-100 focus:ring-white shadow-lg hover:shadow-xl';
        case 'secondary':
          return 'text-white bg-blue-500 hover:bg-blue-400 focus:ring-blue-300 shadow-lg hover:shadow-xl';
        case 'outline':
          return 'border-2 border-white text-white hover:bg-white hover:text-blue-600 focus:ring-white shadow-md hover:shadow-lg';
        case 'ghost':
          return 'text-white hover:bg-white hover:bg-opacity-20 focus:ring-white';
        default:
          return 'text-blue-600 bg-white hover:bg-gray-100 focus:ring-white shadow-lg hover:shadow-xl';
      }
    } else {
      // On secondary (light) backgrounds, use theme-aware colors
      switch (variant) {
        case 'primary':
          return 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl';
        case 'secondary':
          return 'text-blue-600 bg-white hover:bg-gray-50 focus:ring-blue-500 border-gray-300 shadow-md hover:shadow-lg';
        case 'outline':
          return 'border-2 border-current text-theme-primary hover:bg-current hover:text-white focus:ring-current shadow-md hover:shadow-lg';
        case 'ghost':
          return 'text-theme-primary hover:bg-theme-primary hover:bg-opacity-10 focus:ring-current';
        default:
          return 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl';
      }
    }
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${getVariantClasses()} ${disabledClasses} ${className}`;

  if (href && !disabled) {
    return (
      <a href={href} className={combinedClasses}>
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {children}
    </button>
  );
}