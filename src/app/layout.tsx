import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Footer from '@/components/Footer';
import { PricingCurrencyProvider } from '@/components/PricingCurrencyProvider';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const defaultTitle = 'Approachable — Making AI Approachable for Everyone';
const defaultDescription =
  'A small-group, mentor-led cohort on AI Foundations, Claude Chat, Agentic AI with Claude Cowork, and Vibe Coding. 20 seats. Live sessions. Real projects.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: '%s — Approachable',
  },
  description: defaultDescription,
  keywords: ['Claude AI', 'Claude Code', 'AI cohort', 'Claude ecosystem', 'AI learning', 'mentor-led', 'Anthropic', 'approachable'],
  openGraph: {
    type: 'website',
    url: '/',
    siteName: SITE_NAME,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Approachable — Claude AI cohort for working professionals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PricingCurrencyProvider>
          {children}
          <Footer />
        </PricingCurrencyProvider>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XG391DQQCV"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XG391DQQCV');
        `}</Script>
        <Script id="clarity-init" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "vbfff98f4y");
        `}</Script>
      </body>
    </html>
  );
}
