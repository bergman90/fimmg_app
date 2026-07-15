'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setUserActive } from '@/app/actions/admin'
import { regenerateInvite } from '@/app/actions/invite'

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
    <div className={`bg-white rounded-[14px] border px-4 py-3.5 ${user.active ? 'border-line' : 'border-red-200 opacity-70'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[14px] font-semibold text-ink">{user.username}</p>
          <p className="text-[11px] text-muted mt-0.5">
            Creato il {new Date(user.createdAt).toLocaleDateString('it-IT')}
            {' · '}
            {hasPassword ? 'password impostata' : (
              <span className="text-amber-deep font-semibold">password non ancora impostata</span>
            )}
          </p>
          {pendingToken && !hasPassword && (
            <p className="text-[11px] text-muted mt-0.5">
              Link invito scade: {new Date(pendingToken.expiresAt).toLocaleString('it-IT')}
            </p>
          )}
        </div>
        <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-[.06em] px-2 py-1 rounded-full ${
          user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {user.active ? 'attivo' : 'disattivo'}
        </span>
      </div>

      {/* Link copiato */}
      {linkResult && (
        <div className="mt-3 flex gap-2 items-start bg-[#F5F8F9] rounded-lg p-2">
          <p className="font-mono text-[10px] text-ink break-all flex-1">{linkResult}</p>
          <button
            onClick={() => { navigator.clipboard.writeText(linkResult); setLinkResult(null) }}
            className="flex-shrink-0 bg-petrol text-white text-[10px] font-bold px-2 py-1 rounded cursor-pointer"
          >
            Copia
          </button>
        </div>
      )}

      {/* Azioni */}
      <div className="flex gap-2 mt-3 flex-wrap">
        <button
          onClick={toggleActive}
          disabled={isPending}
          className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition disabled:opacity-50 cursor-pointer ${
            user.active
              ? 'border-red-200 text-red-600 hover:bg-red-50'
              : 'border-green-200 text-green-700 hover:bg-green-50'
          }`}
        >
          {user.active ? 'Disattiva' : 'Riattiva'}
        </button>
        <button
          onClick={handleRegenerateLink}
          disabled={isPending}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-line text-muted hover:bg-[#F5F8F9] transition disabled:opacity-50 cursor-pointer"
        >
          Rigenera link
        </button>
      </div>
    </div>
  )
}
