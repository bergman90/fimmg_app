'use client'

import { useState, useTransition, useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  toggleDocument,
  deleteDocument,
  updateDocument,
  type DocumentResult,
} from '@/app/actions/admin'
import styles from '../Admin.module.css'

interface DocumentItem {
  id: string
  title: string
  filename: string
  folder: string
  active: boolean
}

function EditDocumentForm({
  id,
  defaultTitle,
  defaultFolder,
  folders,
  onDone,
}: {
  id: string
  defaultTitle: string
  defaultFolder: string
  folders: string[]
  onDone: () => void
}) {
  const action = updateDocument.bind(null, id)
  const [state, formAction, pending] = useActionState<DocumentResult | null, FormData>(action, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state && 'ok' in state) onDone()
  }, [state, onDone])

  return (
    <form ref={formRef} action={formAction} noValidate className={styles.form}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Titolo</label>
        <input name="title" type="text" required defaultValue={defaultTitle} className={styles.field} />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Cartella</label>
        <input
          name="folder"
          type="text"
          required
          list="folder-suggestions-edit"
          defaultValue={defaultFolder}
          className={styles.field}
        />
        <datalist id="folder-suggestions-edit">
          {folders.map(f => <option key={f} value={f} />)}
        </datalist>
      </div>
      <div className={styles.formFooter}>
        <button type="submit" disabled={pending} className={`${styles.button} ${styles.primaryButton}`}>
          {pending ? 'Salvataggio...' : 'Salva'}
        </button>
        {state && 'error' in state && <p className={styles.messageError}>{state.error}</p>}
      </div>
    </form>
  )
}

export default function DocumentList({ documents, folders }: { documents: DocumentItem[]; folders: string[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleToggle(id: string) {
    startTransition(async () => {
      await toggleDocument(id)
      router.refresh()
    })
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`Eliminare il documento "${title}"? Il file resterà nel repository, viene rimosso solo il collegamento.`)) return
    startTransition(async () => {
      await deleteDocument(id)
      router.refresh()
    })
  }

  if (documents.length === 0) {
    return <p className={styles.empty}>Nessun documento ancora collegato.</p>
  }

  const grouped = new Map<string, DocumentItem[]>()
  for (const d of documents) {
    if (!grouped.has(d.folder)) grouped.set(d.folder, [])
    grouped.get(d.folder)!.push(d)
  }

  return (
    <div className={styles.list}>
      {Array.from(grouped.entries()).map(([folder, docs]) => (
        <div key={folder}>
          <p className={styles.kicker} style={{ marginTop: 6 }}>{folder}</p>
          <div className={styles.list}>
            {docs.map(d => (
              <article key={d.id} className={`${styles.item} ${d.active ? '' : styles.itemInactive}`}>
                {editingId === d.id ? (
                  <div className={styles.editBox}>
                    <p className={styles.kicker}>Modifica documento</p>
                    <EditDocumentForm
                      id={d.id}
                      defaultTitle={d.title}
                      defaultFolder={d.folder}
                      folders={folders}
                      onDone={() => {
                        setEditingId(null)
                        router.refresh()
                      }}
                    />
                    <div className={styles.actions}>
                      <button onClick={() => setEditingId(null)} className={styles.button}>Annulla</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.itemTop}>
                      <div className={styles.itemMain}>
                        <p className={styles.itemTitle}>{d.title}</p>
                        <p className={styles.meta}>{d.filename}</p>
                      </div>
                      <span className={`${styles.status} ${d.active ? styles.statusActive : styles.statusNeutral}`}>
                        {d.active ? 'visibile' : 'nascosto'}
                      </span>
                    </div>

                    <div className={styles.actions}>
                      <button onClick={() => setEditingId(d.id)} className={styles.button}>Modifica</button>
                      <button
                        onClick={() => handleToggle(d.id)}
                        disabled={isPending}
                        className={`${styles.button} ${d.active ? styles.warnButton : styles.successButton}`}
                      >
                        {d.active ? 'Nascondi' : 'Mostra'}
                      </button>
                      <button
                        onClick={() => handleDelete(d.id, d.title)}
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
        </div>
      ))}
    </div>
  )
}
