import type { ServicesBodyProps } from './Services.types';

export function ServicesBody({ children, className = '' }: ServicesBodyProps) {
  return (
    <div className="text-center mb-12">
      <p className={`text-xl text-theme-secondary max-w-3xl mx-auto ${className}`}>
        {children}
      </p>
    </div>
  );
}