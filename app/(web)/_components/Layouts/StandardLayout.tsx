'use client';

import { NavigationProvider, ScrollProvider } from '@/app/(web)/_providers';
import { NavigationHeader } from '@/app/(web)/_components';
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
          <section className="pt-32 pb-16 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {title && (
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
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
      </ScrollProvider>
    </NavigationProvider>
  );
}