'use client'

import { useActionState } from 'react'
import { loginAdmin, type ActionResult } from '@/app/actions/auth'

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(loginAdmin, null)

  return (
    <form action={action} noValidate>
      <label className="block text-[11px] font-semibold uppercase tracking-[.08em] text-muted mb-1.5">
        Username
      </label>
      <input
        name="username"
        type="text"
        autoComplete="username"
        required
        className="w-full bg-[#F5F8F9] border border-line rounded-xl px-3.5 py-3 text-[15px] font-mono text-ink outline-none focus:border-petrol focus:bg-white transition"
      />

      <label className="block text-[11px] font-semibold uppercase tracking-[.08em] text-muted mb-1.5 mt-4">
        Password
      </label>
      <input
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="w-full bg-[#F5F8F9] border border-line rounded-xl px-3.5 py-3 text-[15px] font-mono text-ink outline-none focus:border-petrol focus:bg-white transition"
      />

      {state && 'error' in state && (
        <p className="mt-3 text-[13px] text-red-600 font-medium">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full mt-5 bg-petrol hover:bg-[#075d79] text-white rounded-xl py-[15px] text-[15px] font-bold transition disabled:opacity-60 cursor-pointer"
      >
        {pending ? 'Accesso…' : 'Accedi'}
      </button>
    </form>
  )
}
