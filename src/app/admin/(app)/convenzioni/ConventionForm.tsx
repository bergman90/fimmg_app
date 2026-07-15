'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createConvention, updateConvention, type ConventionResult } from '@/app/actions/admin'
import styles from '../Admin.module.css'

interface Props {
  mode: 'create'
  onSuccess?: () => void
}

interface EditProps {
  mode: 'edit'
  id: string
  defaultName: string
  defaultBenefitText: string
  defaultTags: string
  onSuccess?: () => void
}

export default function ConventionForm(props: Props | EditProps) {
  const isEdit = props.mode === 'edit'
  const action = isEdit
    ? updateConvention.bind(null, (props as EditProps).id)
    : createConvention

  const [state, formAction, pending] = useActionState<ConventionResult | null, FormData>(action, null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state && 'ok' in state) {
      if (!isEdit) formRef.current?.reset()
      props.onSuccess?.()
    }
  }, [state, isEdit, props])

  return (
    <form ref={formRef} action={formAction} noValidate className={styles.form}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Nome attività</label>
        <input
          name="name"
          type="text"
          required
          placeholder="Es. Farmacia Rossi"
          defaultValue={isEdit ? (props as EditProps).defaultName : ''}
          className={styles.field}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Testo beneficio</label>
        <textarea
          name="benefitText"
          required
          rows={3}
          placeholder="Es. <b>10%</b> su tutti i prodotti."
          defaultValue={isEdit ? (props as EditProps).defaultBenefitText : ''}
          className={styles.textarea}
        />
        <p className={styles.panelHint}>HTML consentito: solo &lt;b&gt; per il grassetto.</p>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Tag</label>
        <input
          name="tags"
          type="text"
          placeholder="Es. Salute, Sport, Professionale"
          defaultValue={isEdit ? (props as EditProps).defaultTags : ''}
          className={styles.field}
        />
      </div>

      <div className={styles.formFooter}>
        <button
          type="submit"
          disabled={pending}
          className={`${styles.button} ${styles.primaryButton}`}
        >
          {pending ? 'Salvataggio...' : isEdit ? 'Aggiorna' : 'Aggiungi'}
        </button>

        {state && 'error' in state && (
          <p className={styles.messageError}>{state.error}</p>
        )}
        {state && 'ok' in state && (
          <p className={styles.messageOk}>
            {isEdit ? 'Convenzione aggiornata.' : 'Convenzione aggiunta.'}
          </p>
        )}
      </div>
    </form>
  )
}
