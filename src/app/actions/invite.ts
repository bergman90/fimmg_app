'use server'

import { randomBytes } from 'crypto'
import * as argon2 from 'argon2'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { createSession } from '@/lib/session'

const INVITE_EXPIRY_HOURS = 24

function generateToken(): string {
  return randomBytes(32).toString('hex')
}

function generateUsername(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `FIMMG-SARD-${num}`
}

// ─── Crea un nuovo iscritto + token invito (solo admin) ───────────────────────

export type CreateInviteResult =
  | { error: string }
  | { ok: true; username: string; inviteUrl: string }

export async function createInvite(): Promise<CreateInviteResult> {
  await requireAdmin()

  // Genera username univoco (max 10 tentativi)
  let username = ''
  for (let i = 0; i < 10; i++) {
    const candidate = generateUsername()
    const exists = await db.user.findUnique({ where: { username: candidate } })
    if (!exists) { username = candidate; break }
  }
  if (!username) return { error: 'Impossibile generare username univoco. Riprova.' }

  const token = generateToken()
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000)

  const user = await db.user.create({
    data: {
      username,
      inviteTokens: {
        create: { token, expiresAt },
      },
    },
  })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const inviteUrl = `${baseUrl}/invito/${token}`

  return { ok: true, username: user.username, inviteUrl }
}

// ─── Rigenera token invito per utente esistente (solo admin) ──────────────────

export type RegenerateInviteResult = { error: string } | { ok: true; inviteUrl: string }

export async function regenerateInvite(userId: string): Promise<RegenerateInviteResult> {
  await requireAdmin()

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) return { error: 'Utente non trovato.' }

  // Invalida i token precedenti (ancora inutilizzati)
  await db.inviteToken.deleteMany({
    where: { userId, usedAt: null },
  })

  const token = generateToken()
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000)

  await db.inviteToken.create({ data: { token, userId, expiresAt } })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  return { ok: true, inviteUrl: `${baseUrl}/invito/${token}` }
}

// ─── Riscatta il token (l'iscritto sceglie la password) ──────────────────────

const RedeemSchema = z.object({
  password: z.string().min(8, 'La password deve avere almeno 8 caratteri').max(256),
})

export type RedeemResult = { error: string } | { ok: true }

export async function redeemInvite(
  token: string,
  _prev: RedeemResult | null,
  formData: FormData,
): Promise<RedeemResult> {
  const parsed = RedeemSchema.safeParse({ password: formData.get('password') })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const inviteToken = await db.inviteToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (
    !inviteToken ||
    inviteToken.usedAt !== null ||
    inviteToken.expiresAt < new Date()
  ) {
    return { error: 'Link non valido o scaduto. Contatta l\'associazione.' }
  }

  const passwordHash = await argon2.hash(parsed.data.password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  })

  await db.$transaction([
    db.user.update({
      where: { id: inviteToken.userId },
      data: { passwordHash },
    }),
    db.inviteToken.update({
      where: { id: inviteToken.id },
      data: { usedAt: new Date() },
    }),
  ])

  await createSession({ role: 'user', userId: inviteToken.userId })
  redirect('/tessera')
}
