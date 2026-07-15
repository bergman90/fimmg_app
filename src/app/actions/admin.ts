'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { sanitizeBenefitText } from '@/lib/sanitize'

// ─── Utenti ───────────────────────────────────────────────────────────────────

export type UserActionResult = { error: string } | { ok: true }

export async function setUserActive(userId: string, active: boolean): Promise<UserActionResult> {
  await requireAdmin()
  await db.user.update({ where: { id: userId }, data: { active } })
  revalidatePath('/admin/utenti')
  return { ok: true }
}

// ─── Convenzioni ──────────────────────────────────────────────────────────────

const ConventionSchema = z.object({
  name:        z.string().min(1, 'Il nome è obbligatorio').max(120),
  benefitText: z.string().min(1, 'Il testo beneficio è obbligatorio').max(500),
  tags:        z.string().max(300),   // CSV di tag, es. "Salute, Sport"
})

export type ConventionResult = { error: string } | { ok: true }

function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
    .slice(0, 10)  // max 10 tag per convenzione
}

export async function createConvention(
  _prev: ConventionResult | null,
  formData: FormData,
): Promise<ConventionResult> {
  await requireAdmin()

  const parsed = ConventionSchema.safeParse({
    name:        formData.get('name'),
    benefitText: formData.get('benefitText'),
    tags:        formData.get('tags') ?? '',
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const tags = parseTags(parsed.data.tags)

  await db.convention.create({
    data: {
      name:        parsed.data.name,
      benefitText: sanitizeBenefitText(parsed.data.benefitText),
      tags: {
        connectOrCreate: tags.map(name => ({
          where:  { name },
          create: { name },
        })),
      },
    },
  })

  revalidatePath('/admin/convenzioni')
  return { ok: true }
}

export async function updateConvention(
  id: string,
  _prev: ConventionResult | null,
  formData: FormData,
): Promise<ConventionResult> {
  await requireAdmin()

  const parsed = ConventionSchema.safeParse({
    name:        formData.get('name'),
    benefitText: formData.get('benefitText'),
    tags:        formData.get('tags') ?? '',
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const tags = parseTags(parsed.data.tags)

  await db.convention.update({
    where: { id },
    data: {
      name:        parsed.data.name,
      benefitText: sanitizeBenefitText(parsed.data.benefitText),
      tags: {
        set: [],   // rimuove tutti i tag esistenti
        connectOrCreate: tags.map(name => ({
          where:  { name },
          create: { name },
        })),
      },
    },
  })

  revalidatePath('/admin/convenzioni')
  return { ok: true }
}

export async function toggleConvention(id: string): Promise<UserActionResult> {
  await requireAdmin()
  const conv = await db.convention.findUniqueOrThrow({ where: { id }, select: { active: true } })
  await db.convention.update({ where: { id }, data: { active: !conv.active } })
  revalidatePath('/admin/convenzioni')
  return { ok: true }
}

export async function deleteConvention(id: string): Promise<UserActionResult> {
  await requireAdmin()
  await db.convention.delete({ where: { id } })
  revalidatePath('/admin/convenzioni')
  return { ok: true }
}
