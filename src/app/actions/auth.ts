'use server'

import { z } from 'zod'
import * as argon2 from 'argon2'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { createSession, deleteSession } from '@/lib/session'
import { isRateLimited } from '@/lib/rate-limit'

// Finestra: max 5 tentativi ogni 15 minuti per IP
const LOGIN_LIMIT = 5
const LOGIN_WINDOW_MS = 15 * 60 * 1000

const LoginSchema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(256),
})

export type ActionResult = { error: string } | { ok: true }

// ─── Login iscritto ───────────────────────────────────────────────────────────

export async function loginUser(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const headerStore = await headers()
  const ip = headerStore.get('x-forwarded-for') ?? 'unknown'

  if (isRateLimited(`login:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW_MS)) {
    return { error: 'Troppi tentativi. Riprova tra qualche minuto.' }
  }

  const parsed = LoginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { error: 'Credenziali non valide.' }
  }

  const { username, password } = parsed.data

  const user = await db.user.findUnique({ where: { username } })

  // Verifica a tempo costante anche se l'utente non esiste (anti-timing attack)
  const dummyHash =
    '$argon2id$v=19$m=65536,t=3,p=4$dummysaltdummysalt$dummyhashvaluedummyhashvalue'
  const hashToCheck = user?.passwordHash ?? dummyHash

  let passwordOk = false
  try {
    passwordOk = await argon2.verify(hashToCheck, password)
  } catch {
    return { error: 'Errore interno. Riprova.' }
  }

  if (!user || !passwordOk || !user.active) {
    return { error: 'Username o password errati, oppure account disattivato.' }
  }

  await createSession({ role: 'user', userId: user.id })
  redirect('/tessera')
}

// ─── Login admin ──────────────────────────────────────────────────────────────

export async function loginAdmin(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const headerStore = await headers()
  const ip = headerStore.get('x-forwarded-for') ?? 'unknown'

  if (isRateLimited(`admin-login:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW_MS)) {
    return { error: 'Troppi tentativi. Riprova tra qualche minuto.' }
  }

  const parsed = LoginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  })
  if (!parsed.success) {
    return { error: 'Credenziali non valide.' }
  }

  const { username, password } = parsed.data

  const admin = await db.admin.findUnique({ where: { username } })

  const dummyHash =
    '$argon2id$v=19$m=65536,t=3,p=4$dummysaltdummysalt$dummyhashvaluedummyhashvalue'
  const hashToCheck = admin?.passwordHash ?? dummyHash

  let passwordOk = false
  try {
    passwordOk = await argon2.verify(hashToCheck, password)
  } catch {
    return { error: 'Errore interno. Riprova.' }
  }

  if (!admin || !passwordOk) {
    return { error: 'Credenziali non valide.' }
  }

  await createSession({ role: 'admin', adminId: admin.id })
  redirect('/admin')
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/login')
}
