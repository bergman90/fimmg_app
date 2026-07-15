import { db } from '@/lib/db'
import CreateUserButton from './CreateUserButton'
import UserRow from './UserRow'
import styles from '../Admin.module.css'

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
  const activeCount = users.filter(user => user.active).length
  const pendingCount = users.filter(user => !user.passwordHash).length

  return (
    <div>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.kicker}>Gestione iscritti</p>
          <h1 className={styles.title}>Utenti</h1>
          <p className={styles.subtitle}>
            {users.length} iscritti totali · {activeCount} attivi · {pendingCount} in attesa di password
          </p>
        </div>
        <CreateUserButton />
      </header>

      {users.length === 0 ? (
        <div className={styles.panel}>
          <div className={styles.empty}>
          Nessun utente ancora. Crea il primo iscritto.
          </div>
        </div>
      ) : (
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Elenco iscritti</h2>
              <p className={styles.panelHint}>
                Crea inviti, rigenera link e gestisci lo stato degli account.
              </p>
            </div>
          </div>
          <div className={styles.panelBody}>
            <div className={styles.list}>
              {users.map(u => (
                <UserRow key={u.id} user={u} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
