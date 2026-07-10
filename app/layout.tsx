import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
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
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f5f0' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1622' },
  ],
}

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('nordisk-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored ? stored === 'dark' : prefersDark;
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} bg-background`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
