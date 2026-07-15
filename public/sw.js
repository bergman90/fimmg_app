// Service Worker FIMMG Sardegna
// Mette in cache la pagina tessera per uso offline.

const CACHE = 'fimmg-v1'

const PRECACHE = [
  '/tessera',
  '/logo-white.png',
  '/logo-color.png',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  // Le richieste API/actions passano sempre dalla rete
  if (url.pathname.startsWith('/verifica') || url.pathname.startsWith('/_next/')) {
    return
  }

  // Strategia network-first per la tessera, fallback cache
  if (url.pathname === '/tessera' || PRECACHE.includes(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone()
          caches.open(CACHE).then(cache => cache.put(event.request, clone))
          return res
        })
        .catch(() => caches.match(event.request))
    )
  }
})
