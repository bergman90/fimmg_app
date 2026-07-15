'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createConvention, updateConvention, type ConventionResult } from '@/app/actions/admin'

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
    <form ref={formRef} action={formAction} noValidate className="flex flex-col gap-3">
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[.08em] text-muted mb-1">
          Nome attività
        </label>
        <input
          name="name"
          type="text"
          required
          placeholder="Es. Farmacia Rossi"
          defaultValue={isEdit ? (props as EditProps).defaultName : ''}
          className="w-full bg-[#F5F8F9] border border-line rounded-xl px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-petrol focus:bg-white transition"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[.08em] text-muted mb-1">
          Testo beneficio (HTML consentito: &lt;b&gt;)
        </label>
        <textarea
          name="benefitText"
          required
          rows={3}
          placeholder="Es. <b>10%</b> su tutti i prodotti."
          defaultValue={isEdit ? (props as EditProps).defaultBenefitText : ''}
          className="w-full bg-[#F5F8F9] border border-line rounded-xl px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-petrol focus:bg-white transition resize-none"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[.08em] text-muted mb-1">
          Tag (separati da virgola)
        </label>
        <input
          name="tags"
          type="text"
          placeholder="Es. Salute, Sport, Professionale"
          defaultValue={isEdit ? (props as EditProps).defaultTags : ''}
          className="w-full bg-[#F5F8F9] border border-line rounded-xl px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-petrol focus:bg-white transition"
        />
      </div>

      {state && 'error' in state && (
        <p className="text-[13px] text-red-600 font-medium">{state.error}</p>
      )}
      {state && 'ok' in state && (
        <p className="text-[13px] text-green-700 font-medium">
          {isEdit ? 'Convenzione aggiornata.' : 'Convenzione aggiunta.'}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start bg-petrol text-white text-[13px] font-bold px-5 py-2.5 rounded-lg hover:bg-[#075d79] transition disabled:opacity-60 cursor-pointer"
      >
        {pending ? 'Salvataggio…' : isEdit ? 'Aggiorna' : 'Aggiungi'}
      </button>
    </form>
  )
}
