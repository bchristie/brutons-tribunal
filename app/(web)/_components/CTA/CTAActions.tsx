import type { CTAActionsProps } from './CTA.types';

export function CTAActions({ 
  children, 
  className = '', 
  layout = 'horizontal',
  gap = 'md' 
}: CTAActionsProps) {
  const layoutClasses = {
    horizontal: 'flex-col sm:flex-row',
    vertical: 'flex-col'
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  return (
    <div className={`flex ${layoutClasses[layout]} ${gapClasses[gap]} justify-center items-center ${className}`}>
      {children}
    </div>
  );
}