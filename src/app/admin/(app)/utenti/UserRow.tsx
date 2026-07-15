'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setUserActive } from '@/app/actions/admin'
import { regenerateInvite } from '@/app/actions/invite'
import styles from '../Admin.module.css'

interface User {
  id: string
  username: string
  active: boolean
  createdAt: Date
  passwordHash: string | null
  inviteTokens: { token: string; expiresAt: Date }[]
}

export default function UserRow({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition()
  const [linkResult, setLinkResult] = useState<string | null>(null)
  const router = useRouter()

  const pendingToken = user.inviteTokens[0]
  const hasPassword = !!user.passwordHash

  function toggleActive() {
    startTransition(async () => {
      await setUserActive(user.id, !user.active)
      router.refresh()
    })
  }

  function handleRegenerateLink() {
    startTransition(async () => {
      const res = await regenerateInvite(user.id)
      if ('ok' in res) {
        setLinkResult(res.inviteUrl)
        router.refresh()
      }
    })
  }

  return (
    <article className={`${styles.item} ${user.active ? '' : styles.itemInactive}`}>
      <div className={styles.itemTop}>
        <div className={styles.itemMain}>
          <p className={styles.monoTitle}>{user.username}</p>
          <p className={styles.meta}>
            Creato il {new Date(user.createdAt).toLocaleDateString('it-IT')} ·{' '}
            {hasPassword ? (
              'password impostata'
            ) : (
              <span className={styles.statusWarn}>password non ancora impostata</span>
            )}
          </p>
          {pendingToken && !hasPassword && (
            <p className={styles.meta}>
              Link invito scade: {new Date(pendingToken.expiresAt).toLocaleString('it-IT')}
            </p>
          )}
        </div>
        <span className={`${styles.status} ${user.active ? styles.statusActive : styles.statusInactive}`}>
          {user.active ? 'attivo' : 'disattivo'}
        </span>
      </div>

      {linkResult && (
        <div className={styles.linkBox}>
          <p className={styles.linkText}>{linkResult}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(linkResult)
              setLinkResult(null)
            }}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            Copia
          </button>
        </div>
      )}

      <div className={styles.actions}>
        <button
          onClick={toggleActive}
          disabled={isPending}
          className={`${styles.button} ${user.active ? styles.dangerButton : styles.successButton}`}
        >
          {user.active ? 'Disattiva' : 'Riattiva'}
        </button>
        <button
          onClick={handleRegenerateLink}
          disabled={isPending}
          className={styles.button}
        >
          Rigenera link
        </button>
      </div>
    </article>
  )
}
