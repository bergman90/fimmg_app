'use client'

import { useActionState } from 'react'
import { redeemInvite, type RedeemResult } from '@/app/actions/invite'

export default function RedeemForm({ token }: { token: string }) {
  const action = redeemInvite.bind(null, token)
  const [state, formAction, pending] = useActionState<RedeemResult | null, FormData>(
    action,
    null,
  )

  return (
    <form action={formAction} noValidate>
      <label className="block text-[11px] font-semibold uppercase tracking-[.08em] text-[#6B8792] mb-1.5">
        Password
      </label>
      <input
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Minimo 8 caratteri"
        required
        minLength={8}
        className="w-full bg-[#F5F8F9] border border-[#DCE6E9] rounded-xl px-3.5 py-3 text-[15px] font-mono text-[#0A2A34] placeholder:text-[#A9BEC6] outline-none focus:border-[#06556E] focus:bg-white transition"
      />

      {state && 'error' in state && (
        <p className="mt-3 text-[13px] text-red-600 font-medium">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full mt-5 bg-[#06556E] hover:bg-[#075d79] active:scale-[.985] text-white rounded-xl py-[15px] text-[15px] font-bold tracking-[.01em] transition disabled:opacity-60 cursor-pointer"
      >
        {pending ? 'Conferma in corso…' : 'Imposta password e accedi'}
      </button>
    </form>
  )
}
