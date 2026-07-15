'use client'

import { useActionState } from 'react'
import { loginUser, type ActionResult } from '@/app/actions/auth'
import styles from './Login.module.css'

export default function LoginForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    loginUser,
    null,
  )

  return (
    <form action={action} noValidate>
      <label className={styles.label} htmlFor="username">
        Nome utente
      </label>
      <input
        id="username"
        name="username"
        type="text"
        autoComplete="username"
        placeholder="FIMMG-SARD-4837"
        required
        className={styles.field}
      />

      <label className={styles.label} htmlFor="password">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••••"
        required
        className={styles.field}
      />

      {state && 'error' in state && (
        <p className={styles.error}>{state.error}</p>
      )}

      <button type="submit" disabled={pending} className={styles.button}>
        {pending ? 'Accesso in corso...' : 'Accedi'}
      </button>
    </form>
  )
}
