import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import RevealInit from '@/components/RevealInit';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { SITE } from '@/content/site';

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});
const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://li-lab.example'),
  title: {
    default: `${SITE.labName} — ${SITE.tagline}`,
    template: `%s — ${SITE.labName}`,
  },
  description: SITE.thesis,
  openGraph: {
    title: `${SITE.labName} — ${SITE.tagline}`,
    description: SITE.thesis,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="sr-only-focusable">
          Skip to content
        </a>
        <SmoothScroll>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>
        <RevealInit />
      </body>
    </html>
  );
}
