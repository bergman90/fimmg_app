'use client'

import { useState, useTransition } from 'react'
import { createInvite } from '@/app/actions/invite'
import { useRouter } from 'next/navigation'

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
        className="bg-petrol text-white text-[13px] font-bold px-4 py-2 rounded-lg hover:bg-[#075d79] transition disabled:opacity-60 cursor-pointer"
      >
        {isPending ? 'Creazione…' : '+ Nuovo iscritto'}
      </button>

      {error && (
        <p className="mt-2 text-[13px] text-red-600">{error}</p>
      )}

      {result && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setResult(null)}>
          <div className="bg-white rounded-[18px] p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[17px] font-bold text-ink mb-1">Iscritto creato</h2>
            <p className="text-[13px] text-muted mb-4">Copia il link e invialo all'iscritto. Scade in 72h.</p>

            <div className="mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-[.08em] text-muted mb-1">Username</p>
              <p className="font-mono text-[14px] font-semibold text-petrol">{result.username}</p>
            </div>

            <div className="mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-[.08em] text-muted mb-1">Link di invito</p>
              <div className="flex gap-2 items-start">
                <p className="font-mono text-[11px] text-ink break-all bg-[#F5F8F9] rounded-lg p-2 flex-1">
                  {result.inviteUrl}
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(result.inviteUrl)}
                  className="flex-shrink-0 bg-petrol text-white text-[11px] font-bold px-3 py-2 rounded-lg cursor-pointer"
                >
                  Copia
                </button>
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full border border-line text-[13px] font-semibold text-muted py-2.5 rounded-xl hover:bg-[#F5F8F9] transition cursor-pointer"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
