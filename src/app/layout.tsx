import type { Metadata, Viewport } from 'next';
import '../css/variables.css';
import '../css/style.css';

import MyPegAppShell from '@/components/MyPegAppShell';

export const metadata: Metadata = {
  title: 'SUNCASA Kigali | Nature-Based Solutions Impact Platform (PWA)',
  description: 'Official PWA impact dashboard for the SUNCASA project in Kigali communicating Nature-Based Solutions across the Lower Nyabarongo River watershed.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#10b981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=Oswald:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <MyPegAppShell>
          {children}
        </MyPegAppShell>
      </body>
    </html>
  );
}
