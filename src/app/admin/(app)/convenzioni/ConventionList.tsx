'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleConvention, deleteConvention } from '@/app/actions/admin'
import ConventionForm from './ConventionForm'
import styles from '../Admin.module.css'

interface Convention {
  id: string
  name: string
  benefitText: string
  active: boolean
  tags: string[]
}

export default function ConventionList({ conventions }: { conventions: Convention[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleToggle(id: string) {
    startTransition(async () => {
      await toggleConvention(id)
      router.refresh()
    })
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Eliminare la convenzione "${name}"?`)) return
    startTransition(async () => {
      await deleteConvention(id)
      router.refresh()
    })
  }

  if (conventions.length === 0) {
    return <p className={styles.empty}>Nessuna convenzione ancora.</p>
  }

  return (
    <div className={styles.list}>
      {conventions.map(c => (
        <article key={c.id} className={`${styles.item} ${c.active ? '' : styles.itemInactive}`}>
          {editingId === c.id ? (
            <div className={styles.editBox}>
              <p className={styles.kicker}>Modifica convenzione</p>
              <ConventionForm
                mode="edit"
                id={c.id}
                defaultName={c.name}
                defaultBenefitText={c.benefitText}
                defaultTags={c.tags.join(', ')}
                onSuccess={() => {
                  setEditingId(null)
                  router.refresh()
                }}
              />
              <div className={styles.actions}>
                <button onClick={() => setEditingId(null)} className={styles.button}>
                  Annulla
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.itemTop}>
                <div className={styles.itemMain}>
                  <p className={styles.itemTitle}>{c.name}</p>
                  {c.tags.length > 0 && (
                    <div className={styles.tags}>
                      {c.tags.map(t => (
                        <span key={t} className={styles.tag}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className={`${styles.status} ${c.active ? styles.statusActive : styles.statusNeutral}`}>
                  {c.active ? 'attiva' : 'inattiva'}
                </span>
              </div>

              <p className={styles.benefit} dangerouslySetInnerHTML={{ __html: c.benefitText }} />

              <div className={styles.actions}>
                <button onClick={() => setEditingId(c.id)} className={styles.button}>
                  Modifica
                </button>
                <button
                  onClick={() => handleToggle(c.id)}
                  disabled={isPending}
                  className={`${styles.button} ${c.active ? styles.warnButton : styles.successButton}`}
                >
                  {c.active ? 'Disattiva' : 'Riattiva'}
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  disabled={isPending}
                  className={`${styles.button} ${styles.dangerButton}`}
                >
                  Elimina
                </button>
              </div>
            </>
          )}
        </article>
      ))}
    </div>
  )
}
