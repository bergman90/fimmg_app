'use server'

import { requireUser } from '@/lib/auth'
import { signQrToken } from '@/lib/qr'

/**
 * Genera un token QR valido 60 secondi per l'utente autenticato.
 * Da chiamare dalla pagina tessera ogni ~50s per tenere il QR fresco.
 */
export async function generateQrToken(): Promise<string> {
  const session = await requireUser()
  return signQrToken(session.userId)
}
