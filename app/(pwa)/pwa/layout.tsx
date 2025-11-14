import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalProviders } from '@/src/providers/GlobalProviders';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { getCurrentUser } from '@/src/providers/auth/server';
import "../../globals.css";

// Force dynamic rendering since we have user-based layouts and widgets
export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Bruton\'s Tribunal - App',
  description: 'Mobile app experience for Bruton\'s Tribunal',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bruton\'s Tribunal',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export default async function PWALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user on server-side to avoid client-side auth state bouncing
  const user = await getCurrentUser();

  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/icon" />
        <link rel="apple-touch-icon" href="/apple-icon" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-gray-50 dark:bg-gray-900`}>
        <GlobalProviders>
          <AuthProvider initialUser={user}>
            <main className="h-full">
              {children}
            </main>
          </AuthProvider>
        </GlobalProviders>
      </body>
    </html>
  );
}