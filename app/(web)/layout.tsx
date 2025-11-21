import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GlobalProviders, AuthProvider } from '@/src/providers';
import { getCurrentUser, getCurrentSession } from '@/src/providers/auth/server';
import "../globals.css";
import "./styles.css";

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
  title: "Bruton's Tribunal",
  description: "Professional legal services with integrity and excellence",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility
  userScalable: true,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch user and session on server-side to avoid client-side auth state bouncing
  const [user, session] = await Promise.all([
    getCurrentUser(),
    getCurrentSession(),
  ]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalProviders>
          <AuthProvider initialUser={user} initialSession={session}>
            {children}
          </AuthProvider>
        </GlobalProviders>
      </body>
    </html>
  );
}