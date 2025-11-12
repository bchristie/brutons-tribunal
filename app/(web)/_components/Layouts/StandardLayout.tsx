'use client';

import { NavigationProvider, ScrollProvider } from '@/app/(web)/_providers';
import { NavigationHeader, FloatingActions, Footer } from '@/app/(web)/_components';
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
        <Footer backgroundColor="dark" totalColumns={12}>
          <Footer.Section title="Navigation" width={3}>
            <a href="/" className="block text-gray-400 hover:text-white transition-colors">
              Home
            </a>
            <a href="/about" className="block text-gray-400 hover:text-white transition-colors">
              About
            </a>
            <a href="/contact" className="block text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
          </Footer.Section>
          
          <Footer.Section title="Legal Services" width={3}>
            <span className="block text-gray-400">Corporate Law</span>
            <span className="block text-gray-400">Litigation</span>
            <span className="block text-gray-400">Estate Planning</span>
          </Footer.Section>
          
          <Footer.Section title="Stay Connected" width={6}>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for legal insights and updates.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </Footer.Section>
        </Footer>

        {/* Floating Actions */}
        <FloatingActions />
      </ScrollProvider>
    </NavigationProvider>
  );
}