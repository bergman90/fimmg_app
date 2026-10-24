'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createDocument, type DocumentResult } from '@/app/actions/admin'
import styles from '../Admin.module.css'

interface Props {
  availableFiles: string[]
  folders: string[]
  onSuccess?: () => void
}

export default function DocumentForm({ availableFiles, folders, onSuccess }: Props) {
  const [state, formAction, pending] = useActionState<DocumentResult | null, FormData>(createDocument, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state && 'ok' in state) {
      formRef.current?.reset()
      onSuccess?.()
    }
  }, [state, onSuccess])

  if (availableFiles.length === 0) {
    return (
      <p className={styles.panelHint}>
        Nessun file caricato in <code>public/documenti</code>. Invia i documenti (PDF, Word...)
        per inserirli nel repository, poi torna qui per collegarli.
      </p>
    )
  }

  return (
    <form ref={formRef} action={formAction} noValidate className={styles.form}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Titolo</label>
        <input
          name="title"
          type="text"
          required
          placeholder="Es. Statuto associativo"
          className={styles.field}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Cartella</label>
        <input
          name="folder"
          type="text"
          required
          list="folder-suggestions"
          placeholder="Es. Archivio ACN"
          className={styles.field}
        />
        <datalist id="folder-suggestions">
          {folders.map(f => <option key={f} value={f} />)}
        </datalist>
        <p className={styles.panelHint}>Scegli una cartella esistente o scrivine una nuova.</p>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>File</label>
        <select name="filename" required defaultValue="" className={styles.field}>
          <option value="" disabled>Seleziona un file...</option>
          {availableFiles.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div className={styles.formFooter}>
        <button
          type="submit"
          disabled={pending}
          className={`${styles.button} ${styles.primaryButton}`}
        >
          {pending ? 'Salvataggio...' : 'Aggiungi'}
        </button>

        {state && 'error' in state && <p className={styles.messageError}>{state.error}</p>}
        {state && 'ok' in state && <p className={styles.messageOk}>Documento aggiunto.</p>}
      </div>
    </form>
  )
}
