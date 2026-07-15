import { db } from '@/lib/db'
import CreateUserButton from './CreateUserButton'
import UserRow from './UserRow'

export default async function UtentiPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      username: true,
      active: true,
      createdAt: true,
      passwordHash: true,
      inviteTokens: {
        where: { usedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { token: true, expiresAt: true },
      },
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[22px] font-extrabold tracking-tight text-ink">Utenti</h1>
          <p className="text-[13px] text-muted">{users.length} iscritti totali</p>
        </div>
        <CreateUserButton />
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 text-muted text-[14px]">
          Nessun utente ancora. Crea il primo iscritto.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map(u => (
            <UserRow key={u.id} user={u} />
          ))}
        </div>
      )}
    </div>
  )
}
