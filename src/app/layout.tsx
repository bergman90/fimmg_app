import type { Metadata, Viewport } from 'next'
import { Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import SwRegister from '@/components/SwRegister'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'FIMMG Sardegna',
  description: 'Tessera iscritti FIMMG Sardegna',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'FIMMG' },
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
