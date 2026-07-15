import { requireUser } from '@/lib/auth'
import { db } from '@/lib/db'
import TesseraClient from './TesseraClient'

export default async function TesseraPage() {
  const session = await requireUser()

  const [user, conventions] = await Promise.all([
    db.user.findUniqueOrThrow({ where: { id: session.userId }, select: { username: true } }),
    db.convention.findMany({
      where: { active: true },
      include: { tags: { select: { name: true } } },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''

  return (
    <TesseraClient
      username={user.username}
      conventions={conventions.map(c => ({
        id: c.id,
        name: c.name,
        benefitText: c.benefitText,
        tags: c.tags.map(t => t.name),
      }))}
      baseUrl={baseUrl}
    />
  )
}
