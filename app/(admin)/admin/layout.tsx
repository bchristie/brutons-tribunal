import { redirect } from 'next/navigation';
import { GlobalProviders } from '@/src/providers/GlobalProviders';
import { getCurrentSession, getCurrentUser } from '@/src/providers/auth/server';
import { Roles } from '@/src/lib/permissions/permissions';
import { AuthProvider } from '@/src/providers/AuthProvider/AuthProviderWrapper';
import { AdminShell } from '../_components';
import { AdminApiProvider, NotificationProvider } from '../_providers';
import { Geist, Geist_Mono } from 'next/font/google';
import { Metadata, Viewport } from 'next';
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
  title: "Admin - Bruton's Tribunal",
  description: "Administrative interface for Bruton's Tribunal",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility
  userScalable: true,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user and session on server-side to avoid client-side auth state bouncing
  const [user, session] = await Promise.all([
    getCurrentUser(),
    getCurrentSession(),
  ]);

  // Check if user is authenticated
  if (!user) {
    redirect('/api/auth/signin?callbackUrl=/admin');
  }

  // Check if user has admin role
  const userRoles = user.roles || [];
  const isAdmin = userRoles.includes(Roles.ADMIN);

  if (!isAdmin) {
    // User is authenticated but not an admin - redirect to unauthorized page
    redirect('/?error=unauthorized');
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalProviders>
          <AuthProvider initialUser={user} initialSession={session}>
            <AdminApiProvider>
              <NotificationProvider>
                <AdminShell>
                  {children}
                </AdminShell>
              </NotificationProvider>
            </AdminApiProvider>
          </AuthProvider>
        </GlobalProviders>
      </body>
    </html>
  );
}
