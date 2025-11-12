import type { CTABodyProps } from './CTA.types';

export function CTABody({ children, className = '' }: CTABodyProps) {
  return (
    <div className={`text-lg mb-8 opacity-90 max-w-2xl mx-auto ${className}`}>
      {children}
    </div>
  );
}