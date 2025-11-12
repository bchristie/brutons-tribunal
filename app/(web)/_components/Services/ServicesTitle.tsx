import type { ServicesTitleProps } from './Services.types';

export function ServicesTitle({ children, className = '' }: ServicesTitleProps) {
  return (
    <div className="text-center mb-12">
      <h2 className={`text-3xl md:text-4xl font-bold text-theme-primary mb-4 ${className}`}>
        {children}
      </h2>
    </div>
  );
}