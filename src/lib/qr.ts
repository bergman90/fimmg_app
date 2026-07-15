import { SignJWT, jwtVerify } from 'jose'

const QR_EXPIRY_S = 60

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET non configurato')
  return new TextEncoder().encode(secret)
}

/**
 * Genera un token QR firmato, valido per 60 secondi.
 * Il payload contiene solo l'userId — nessun dato personale.
 */
export async function signQrToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId, type: 'qr' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${QR_EXPIRY_S}s`)
    .sign(getSecret())
}

export type QrVerifyResult =
  | { valid: true;  userId: string }
  | { valid: false; reason: 'expired' | 'invalid' }

/**
 * Verifica un token QR. Restituisce userId solo internamente —
 * il route handler di verifica non lo espone al client.
 */
export async function verifyQrToken(token: string): Promise<QrVerifyResult> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (payload.type !== 'qr' || typeof payload.sub !== 'string') {
      return { valid: false, reason: 'invalid' }
    }
    return { valid: true, userId: payload.sub }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('exp')) {
      return { valid: false, reason: 'expired' }
    }
    return { valid: false, reason: 'invalid' }
  }
}
