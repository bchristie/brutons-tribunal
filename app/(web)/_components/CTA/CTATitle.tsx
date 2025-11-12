import type { CTATitleProps } from './CTA.types';

export function CTATitle({ children, className = '' }: CTATitleProps) {
  return (
    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${className}`}>
      {children}
    </h2>
  );
}