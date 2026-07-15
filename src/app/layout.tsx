import type { Metadata, Viewport } from 'next'
import { Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import SwRegister from '@/components/SwRegister'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://fimmg-app.onrender.com'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  applicationName: 'FIMMG Sardegna',
  title: 'FIMMG Sardegna',
  description: 'Tessera iscritti FIMMG Sardegna',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '192x192', type: 'image/png' }],
  },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'FIMMG' },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: '/',
    siteName: 'FIMMG Sardegna',
    title: 'FIMMG Sardegna',
    description: 'Tessera iscritti FIMMG Sardegna',
    images: [
      {
        url: '/social-preview.png',
        width: 1200,
        height: 630,
        alt: 'Logo FIMMG Sardegna',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIMMG Sardegna',
    description: 'Tessera iscritti FIMMG Sardegna',
    images: ['/social-preview.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#06556E',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} ${ibmMono.variable} h-full`}>
      <body className="min-h-full font-sans bg-paper text-ink antialiased">
        <SwRegister />
        {children}
      </body>
    </html>
  )
}
