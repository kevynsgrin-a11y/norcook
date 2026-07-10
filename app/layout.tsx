import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const display = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  title: `${SITE_NAME} — Nordic Recipes, Video-First`,
  description:
    'The anti-blog Nordic recipe platform. 77 dishes across Sápmi, Vestlandet, Sørlandet, Østlandet, and modern Nordic bakery — swipe a vertical feed of cooking videos with synced steps, macros, and one-click shopping.',
  generator: 'v0.app',
  keywords: [
    'Nordic recipes',
    'Norwegian food',
    'Sami cooking',
    'Scandinavian recipes',
    'cardamom buns',
    'lutefisk',
    'gravlaks',
    'fårikål',
    'Nordic baking',
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: `${SITE_NAME} — Nordic Recipes, Video-First`,
    description:
      '77 dishes across Sápmi, Vestlandet, Sørlandet, Østlandet, and modern Nordic bakery — synced steps, macros, and one-click shopping.',
    type: 'website',
    siteName: SITE_NAME,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `${SITE_NAME} — Nordic Recipes, Video-First` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Nordic Recipes, Video-First`,
    description:
      '77 dishes across Sápmi, Vestlandet, Sørlandet, Østlandet, and modern Nordic bakery — synced steps, macros, and one-click shopping.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png' }],
    apple: '/icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1a1410',
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark bg-background ${geistSans.variable} ${geistMono.variable} ${display.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
