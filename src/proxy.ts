import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_COOKIE = 'fimmg_session'

function getSecret(): Uint8Array {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error('SESSION_SECRET mancante')
  return new TextEncoder().encode(s)
}

async function getRole(req: NextRequest): Promise<'user' | 'admin' | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret())
    const role = payload.role
    if (role === 'user' || role === 'admin') return role
    return null
  } catch {
    return null
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const role = await getRole(req)

  // ── Route protette iscritto ──────────────────────────────────────────────
  if (pathname.startsWith('/tessera')) {
    if (role !== 'user') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // ── Route protette admin ─────────────────────────────────────────────────
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // ── Redirect se già autenticato ──────────────────────────────────────────
  if (pathname === '/login' && role === 'user') {
    return NextResponse.redirect(new URL('/tessera', req.url))
  }
  if (pathname === '/admin/login' && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  // Escludi file statici, immagini, API interne Next.js e il service worker
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons/|logo-|sw.js|manifest|verifica).*)',
  ],
}
