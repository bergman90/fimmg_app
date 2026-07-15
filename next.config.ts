import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

// CSP: in dev permette 'unsafe-eval' (richiesto da Turbopack HMR)
const cspDirectives = [
  "default-src 'self'",
  isDev
    ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const securityHeaders = [
  // Impedisce il caricamento in iframe (clickjacking)
  { key: 'X-Frame-Options',         value: 'DENY' },
  // Impedisce il MIME-type sniffing
  { key: 'X-Content-Type-Options',  value: 'nosniff' },
  // Limita le informazioni sul referrer inviate ad altri siti
  { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
  // Disabilita funzionalità browser non necessarie
  { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  // Forza HTTPS per 2 anni (solo in produzione)
  ...(!isDev ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }] : []),
  // Content Security Policy
  { key: 'Content-Security-Policy', value: cspDirectives },
]

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
}

export default nextConfig
