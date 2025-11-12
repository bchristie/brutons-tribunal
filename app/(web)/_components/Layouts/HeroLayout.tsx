'use client';

import { NavigationProvider, ScrollProvider } from '@/app/(web)/_providers';
import { NavigationHeader, Hero, FloatingActions, Footer } from '@/app/(web)/_components';
import type { HeroLayoutProps } from './Layouts.types';

export function HeroLayout({ 
  children, 
  menuItems,
  heroImage,
  heroContent,
  heroHeight = 'screen'
}: HeroLayoutProps) {
  return (
    <NavigationProvider>
      <ScrollProvider scrollThreshold={100}>
        {/* Navigation Header */}
        <NavigationHeader 
          logoScale="normal"
          variant="auto"
          menuItems={menuItems}
        />

        {/* Hero Section using compound components */}
        <Hero height={heroHeight}>
          <Hero.Background src={heroImage} overlay="dark" />
          <Hero.Content>
            <Hero.Column>
              {heroContent || (
                <div className="text-white">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                    Welcome to Bruton's Tribunal
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200 mb-8">
                    Professional legal services with integrity and excellence
                  </p>
                  <button className="
                    bg-blue-600 hover:bg-blue-700 text-white font-semibold
                    px-8 py-4 rounded-lg text-lg transition-colors duration-200
                  ">
                    Get Started
                  </button>
                </div>
              )}
            </Hero.Column>
          </Hero.Content>
          <Hero.ScrollIndicator />
        </Hero>

        {/* Main Content */}
        <main className="relative z-20">
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