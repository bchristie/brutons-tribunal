import type { Metadata } from "next";
import { GlobalProviders, AuthProvider } from '@/src/providers';
import { getCurrentUser } from '@/src/providers/auth/server';
import "../../globals.css";

// Force dynamic rendering since we have user-based layouts and widgets
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Brutons Tribunal - PWA",
  description: "Progressive Web App for Brutons Tribunal",
};

export default async function PWALayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch user on server-side to avoid client-side auth state bouncing
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Brutons Tribunal" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className="antialiased">
        <GlobalProviders>
          <AuthProvider initialUser={user}>
            {children}
          </AuthProvider>
        </GlobalProviders>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                      console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}