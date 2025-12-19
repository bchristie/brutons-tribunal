'use client';

import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { buildUrlWithParams } from '@/src/lib/utils/url';

export default function GoMobilePage() {
  const mobileUrl = buildUrlWithParams('/pwa', true);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-gray-900 dark:text-white mb-4">
              <div className="text-2xl md:text-3xl mb-2">Experience</div>
              <div className="text-4xl md:text-5xl mb-2">Bruton's Tribunal</div>
              <div className="text-2xl md:text-3xl">on Mobile</div>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get the best experience designed specifically for your mobile device
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
            <div className="p-8 md:p-12">
              {/* Mobile Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-12 h-12 text-blue-600 dark:text-blue-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
                    />
                  </svg>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-6">
                  Why Mobile?
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Optimized Interface
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Touch-friendly controls and navigation designed for mobile screens
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Lightning Fast
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Progressive web app technology for instant loading
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Stay Connected
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Receive instant notifications and updates on the go
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Install as App
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add to your home screen for quick access anytime
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
                  Access on Your Mobile Device
                </h3>
                <div className="flex flex-col items-center space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                      Scan this QR code or visit on your phone:
                    </p>
                    <div className="bg-white rounded-lg overflow-hidden">
                      {mobileUrl ? (
                        <QRCodeSVG 
                          value={mobileUrl}
                          size={256}
                          level="H"
                          includeMargin={false}
                          className="w-full h-auto"
                        />
                      ) : (
                        <div className="w-full aspect-square bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Loading...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-mono text-lg text-blue-600 dark:text-blue-400 font-semibold">
                      {mobileUrl || 'Loading...'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Or use the mobile version toggle in your account menu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link 
              href="/"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
