'use client';

import { useAuth } from '@/src/providers/AuthProvider';
import { 
  PublicContentPreview, 
  AuthPromptNudge, 
  AuthenticatedWelcome, 
  UnauthenticatedJoinPrompt 
} from '../_components';

export default function PWAHomePage() {
  const { user, isAuthenticated, isLoading, signIn } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pb-16"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4rem)' }}
    >
      {/* Hero Section */}
      <div className="px-4 pt-12 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Bruton's Tribunal
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Where the evidence is poured, the verdict is blind, and the jury is you.
          </p>
        </div>

        {/* Auth Status Section */}
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
  );
}