'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleConvention, deleteConvention } from '@/app/actions/admin'
import ConventionForm from './ConventionForm'

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
    return <p className="text-center text-muted text-[14px] py-8">Nessuna convenzione ancora.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {conventions.map(c => (
        <div key={c.id} className={`bg-white rounded-[14px] border px-4 py-4 ${c.active ? 'border-line' : 'border-dashed border-[#DCE6E9] opacity-70'}`}>
          {editingId === c.id ? (
            <div>
              <p className="text-[11px] font-semibold text-muted uppercase tracking-[.08em] mb-3">Modifica convenzione</p>
              <ConventionForm
                mode="edit"
                id={c.id}
                defaultName={c.name}
                defaultBenefitText={c.benefitText}
                defaultTags={c.tags.join(', ')}
                onSuccess={() => { setEditingId(null); router.refresh() }}
              />
              <button
                onClick={() => setEditingId(null)}
                className="mt-3 text-[12px] text-muted underline cursor-pointer"
              >
                Annulla
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-[15px] font-bold text-ink">{c.name}</p>
                <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-[.06em] px-2 py-1 rounded-full ${
                  c.active ? 'bg-green-100 text-green-700' : 'bg-[#F0F4F5] text-muted'
                }`}>
                  {c.active ? 'attiva' : 'inattiva'}
                </span>
              </div>

              {c.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {c.tags.map(t => (
                    <span key={t} className="text-[10px] font-bold uppercase tracking-[.05em] px-2 py-0.5 rounded-md bg-petrol/10 text-petrol">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-[13px] text-[#4a6470] leading-relaxed mb-3"
                dangerouslySetInnerHTML={{ __html: c.benefitText }} />

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setEditingId(c.id)}
                  className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-line text-muted hover:bg-[#F5F8F9] transition cursor-pointer"
                >
                  Modifica
                </button>
                <button
                  onClick={() => handleToggle(c.id)}
                  disabled={isPending}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition disabled:opacity-50 cursor-pointer ${
                    c.active
                      ? 'border-amber/40 text-amber-deep hover:bg-amber/5'
                      : 'border-green-200 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {c.active ? 'Disattiva' : 'Riattiva'}
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  disabled={isPending}
                  className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50 cursor-pointer"
                >
                  Elimina
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
