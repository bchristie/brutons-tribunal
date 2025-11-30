'use client';

import { StandardLayout } from '@/app/(web)/_components';
import { useAuth } from '@/src/providers/AuthProvider';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function InvitePage() {
  const { signIn, isAuthenticated, user } = useAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const inviterName = searchParams.get('inviter');

  useEffect(() => {
    // If already authenticated, could redirect to dashboard or handle token
    if (isAuthenticated && token) {
      // TODO: Process invitation token if needed
      console.log('User authenticated with invite token:', token);
    }
  }, [isAuthenticated, token]);

  return (
    <StandardLayout
      title="You've Been Invited!"
      description={
        inviterName
          ? `${inviterName} has invited you to join Bruton's Tribunal`
          : "You've been invited to join Bruton's Tribunal"
      }
    >
      <section className="py-16 bg-theme-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content Card */}
          <div className="bg-theme-secondary rounded-xl shadow-lg p-8 md:p-12">
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⚖️</div>
              <h2 className="text-3xl font-bold text-theme-primary mb-4">
                Court is in Session
              </h2>
              {inviterName && (
                <p className="text-xl text-theme-secondary mb-4">
                  <strong>{inviterName}</strong> has summoned you to join the tribunal
                </p>
              )}
              <p className="text-lg text-theme-secondary">
                You've been invited to become part of Plant City's most distinguished 
                spirits tribunal, where every pour is under oath and every verdict matters.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl mb-2">👁️</div>
                <h3 className="font-semibold text-theme-primary mb-2">Plead Blind</h3>
                <p className="text-sm text-theme-secondary">
                  Approach each sample without prejudice or prior knowledge
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">⚖️</div>
                <h3 className="font-semibold text-theme-primary mb-2">Deliver Your Testimony</h3>
                <p className="text-sm text-theme-secondary">
                  Apply your rating—from the Pleadable to the Guilty as Charged
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🔒</div>
                <h3 className="font-semibold text-theme-primary mb-2">Seal the Verdict</h3>
                <p className="text-sm text-theme-secondary">
                  Once all votes are cast, the evidence will be unsealed
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              {isAuthenticated ? (
                <div className="text-center">
                  <p className="text-theme-secondary mb-4">
                    Welcome back, <strong>{user?.name || user?.email}</strong>!
                  </p>
                  <a
                    href="/pwa/dashboard"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                  >
                    Go to Dashboard
                  </a>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-theme-secondary mb-6">
                    Sign in with your Google account to accept this invitation and 
                    join the tribunal. It's free and takes just seconds.
                  </p>
                  <button
                    onClick={() => signIn(token ? `/pwa/dashboard?invite=${token}` : '/pwa/dashboard')}
                    className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-3 rounded-lg border-2 border-gray-300 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-theme-secondary">
            <p>
              Questions about your invitation?{' '}
              <a href="/contact" className="text-blue-600 hover:text-blue-700 underline">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </section>
    </StandardLayout>
  );
}
