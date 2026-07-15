'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createInvite } from '@/app/actions/invite'
import styles from '../Admin.module.css'

export default function CreateUserButton() {
  const [result, setResult] = useState<{ username: string; inviteUrl: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleCreate() {
    setResult(null)
    setError(null)
    startTransition(async () => {
      const res = await createInvite()
      if ('error' in res) {
        setError(res.error)
      } else {
        setResult({ username: res.username, inviteUrl: res.inviteUrl })
        router.refresh()
      }
    })
  }

  return (
    <div>
      <button
        onClick={handleCreate}
        disabled={isPending}
        className={`${styles.button} ${styles.primaryButton}`}
      >
        {isPending ? 'Creazione...' : '+ Nuovo iscritto'}
      </button>

      {error && <p className={styles.messageError}>{error}</p>}

      {result && (
        <div className={styles.modalBackdrop} onClick={() => setResult(null)}>
          <div className={styles.modal} onClick={event => event.stopPropagation()}>
            <h2 className={styles.modalTitle}>Iscritto creato</h2>
            <p className={styles.modalText}>
              Copia il link e invialo all&apos;iscritto. Scade in 24h.
            </p>

            <div className={styles.modalSection}>
              <p className={styles.label}>Username</p>
              <p className={styles.monoTitle}>{result.username}</p>
            </div>

            <div className={styles.modalSection}>
              <p className={styles.label}>Link di invito</p>
              <div className={styles.linkBox}>
                <p className={styles.linkText}>{result.inviteUrl}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(result.inviteUrl)}
                  className={`${styles.button} ${styles.primaryButton}`}
                >
                  Copia
                </button>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => setResult(null)} className={styles.button}>
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
