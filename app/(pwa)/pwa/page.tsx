'use client';

import Image from 'next/image';
import { useAuth } from '@/src/providers/AuthProvider';
import { 
  PublicContentPreview, 
  AuthPromptNudge, 
  AuthenticatedWelcome, 
  UnauthenticatedJoinPrompt,
  PWAInstallNudge
} from '../_components';
import heroImage from '@/public/img/bar-02.jpg';

export default function PWAHomePage() {
  const { user, isAuthenticated, isLoading, signIn } = useAuth();

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const bottomOffset = isAuthenticated ? 'bottom-4' : 'bottom-32';

  return (
    <div className="min-h-dvh">
      {/* Hero Section with Background Image */}
      <div className="relative h-dvh flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-4 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Bruton's Tribunal
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 drop-shadow-md">
            Where the evidence is poured, the verdict is blind, and the jury is you.
          </p>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToContent}
          className={`absolute ${bottomOffset} left-1/2 transform -translate-x-1/2 z-10 animate-bounce cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-2`}
          aria-label="Scroll to content"
        >
          <svg
            className="w-8 h-8 text-white drop-shadow-lg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>

      {/* Content Below the Fold */}
      <div
        className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pb-16"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4rem)' }}
      >
        {/* Auth Status Section */}
        <div className="px-4 pt-12 pb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            {isAuthenticated && user ? (
              <AuthenticatedWelcome user={user} />
            ) : (
              <UnauthenticatedJoinPrompt 
                onSignIn={signIn}
                callbackUrl="/pwa/dashboard"
              />
            )}
          </div>

          {/* PWA Install Nudge */}
          <PWAInstallNudge className="mb-8" />
        </div>

        <PublicContentPreview />

        {/* Spacer for fixed bottom element */}
        {!isAuthenticated && <div className="h-6" />}

        {!isAuthenticated && (
          <AuthPromptNudge 
            onSignIn={signIn}
            callbackUrl="/pwa/dashboard"
          />
        )}
      </div>
    </div>
  );
}