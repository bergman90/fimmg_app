'use client'

import { useActionState } from 'react'
import { loginAdmin, type ActionResult } from '@/app/actions/auth'
import styles from './AdminLogin.module.css'

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(loginAdmin, null)

  return (
    <form action={action} noValidate className={styles.form}>
      <div>
        <label className={styles.label} htmlFor="admin-username">
          Username
        </label>
        <input
          id="admin-username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className={styles.field}
        />
      </div>

      <div>
        <label className={styles.label} htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={styles.field}
        />
      </div>

      {state && 'error' in state && (
        <p className={styles.error}>{state.error}</p>
      )}

      <button type="submit" disabled={pending} className={styles.button}>
        {pending ? 'Accesso in corso...' : 'Accedi'}
      </button>
    </form>
  )
}
