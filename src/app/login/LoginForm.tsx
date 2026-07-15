'use client'

import { useActionState } from 'react'
import { loginUser, type ActionResult } from '@/app/actions/auth'

export default function LoginForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    loginUser,
    null,
  )

  return (
    <form action={action} noValidate>
      <label className="block text-[11px] font-semibold uppercase tracking-[.08em] text-[#6B8792] mb-1.5 mt-0">
        Nome utente
      </label>
      <input
        name="username"
        type="text"
        autoComplete="username"
        placeholder="FIMMG-SARD-0000"
        required
        className="w-full bg-[#F5F8F9] border border-[#DCE6E9] rounded-xl px-3.5 py-3 text-[15px] font-mono text-[#0A2A34] placeholder:text-[#A9BEC6] outline-none focus:border-[#06556E] focus:bg-white transition"
      />

      <label className="block text-[11px] font-semibold uppercase tracking-[.08em] text-[#6B8792] mb-1.5 mt-4">
        Password
      </label>
      <input
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        required
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
        {pending ? 'Accesso in corso…' : 'Accedi'}
      </button>
    </form>
  )
}
