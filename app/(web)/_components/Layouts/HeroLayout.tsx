'use client';

import { NavigationProvider, ScrollProvider } from '@/app/(web)/_providers';
import { NavigationHeader, Hero, FloatingActions } from '@/app/(web)/_components';
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

        {/* Floating Actions */}
        <FloatingActions />
      </ScrollProvider>
    </NavigationProvider>
  );
}