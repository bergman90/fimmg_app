import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FIMMG Sardegna',
    short_name: 'FIMMG',
    description: 'Tessera iscritti FIMMG Sardegna',
    start_url: '/tessera',
    display: 'standalone',
    background_color: '#06556E',
    theme_color: '#06556E',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
