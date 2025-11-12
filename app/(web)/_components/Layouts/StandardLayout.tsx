'use client';

import { NavigationProvider, ScrollProvider } from '@/app/(web)/_providers';
import { NavigationHeader, FloatingActions } from '@/app/(web)/_components';
import { ComposedFooter } from './Footer';
import type { StandardLayoutProps } from './Layouts.types';

export function StandardLayout({ 
  children, 
  menuItems,
  title,
  description
}: StandardLayoutProps) {
  return (
    <NavigationProvider>
      <ScrollProvider scrollThreshold={0}>
        {/* Navigation Header - always in solid state */}
        <NavigationHeader 
          logoScale="small"
          variant="solid"
          menuItems={menuItems}
        />

        {/* Page Header */}
        {(title || description) && (
          <section className="pt-32 pb-16 bg-theme-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {title && (
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-theme-primary mb-4">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-xl text-theme-secondary max-w-3xl">
                  {description}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Main Content */}
        <main className={title || description ? '' : 'pt-32'}>
          {children}
        </main>

        {/* Footer */}
        <ComposedFooter />

        {/* Floating Actions */}
        <FloatingActions />
      </ScrollProvider>
    </NavigationProvider>
  );
}