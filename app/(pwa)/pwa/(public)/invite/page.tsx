'use client';

import { useAuth } from '@/src/providers/AuthProvider';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaEye, FaGavel, FaLock } from 'react-icons/fa';

export default function InvitePage() {
  const { signIn, isAuthenticated, user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const inviterName = searchParams.get('inviter');

  useEffect(() => {
    // If already authenticated, redirect to dashboard with invite token
    if (isAuthenticated && token) {
      router.push(`/pwa/dashboard?invite=${token}`);
    } else if (isAuthenticated && !token) {
      router.push('/pwa/dashboard');
    }
  }, [isAuthenticated, token, router]);

  const benefits = [
    {
      icon: <FaEye className="w-6 h-6" />,
      title: "Plead Blind",
      description: "Approach each sample without prejudice or prior knowledge."
    },
    {
      icon: <FaGavel className="w-6 h-6" />,
      title: "Deliver Your Testimony",
      description: "Apply your rating—from the Pleadable to the Guilty as Charged."
    },
    {
      icon: <FaLock className="w-6 h-6" />,
      title: "Seal the Verdict",
      description: "Once all votes are cast, the evidence will be unsealed, and the true identity and final performance of each spirit will be revealed in a binding judgment."
    }
  ];

  return (
    <div className="min-h-dvh bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚖️</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            You've Been Invited!
          </h1>
          {inviterName && (
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              <strong>{inviterName}</strong> has summoned you to the tribunal
            </p>
          )}
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Where Every Pour is Under Oath!<br />
            Join Plant City's most distinguished spirits tribunal.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mb-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-300">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to Accept Your Summons?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sign in with your Google account to accept this invitation and join the tribunal. 
            It's free and takes just seconds.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => signIn(token ? `/pwa/dashboard?invite=${token}` : '/pwa/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Entering the Tribunal means you are bound by our Standing Orders
              (Terms of Service) and respect the sanctity of your Sealed Records (Privacy Policy).
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Questions about your invitation?{' '}
            <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
