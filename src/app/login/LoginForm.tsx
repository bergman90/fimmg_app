'use client'

import { useActionState } from 'react'
import { loginUser, type ActionResult } from '@/app/actions/auth'

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '.08em',
  color: '#6B8792',
  display: 'block',
  margin: '14px 0 6px',
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  background: '#F5F8F9',
  border: '1px solid #DCE6E9',
  borderRadius: 12,
  padding: '13px 14px',
  fontSize: 15,
  fontFamily: "'IBM Plex Mono', monospace",
  color: '#0A2A34',
  outline: 'none',
  transition: 'border .2s, background .2s',
  boxSizing: 'border-box',
}

const fieldFocusStyle: React.CSSProperties = {
  borderColor: '#06556E',
  background: '#fff',
}

export default function LoginForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    loginUser,
    null,
  )

  return (
    <form action={action} noValidate>
      <label style={labelStyle} htmlFor="username">Nome utente</label>
      <input
        id="username"
        name="username"
        type="text"
        autoComplete="username"
        placeholder="FIMMG-SARD-0000"
        required
        style={fieldStyle}
        onFocus={e => Object.assign(e.target.style, fieldFocusStyle)}
        onBlur={e => Object.assign(e.target.style, { borderColor: '#DCE6E9', background: '#F5F8F9' })}
      />

      <label style={labelStyle} htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        required
        style={fieldStyle}
        onFocus={e => Object.assign(e.target.style, fieldFocusStyle)}
        onBlur={e => Object.assign(e.target.style, { borderColor: '#DCE6E9', background: '#F5F8F9' })}
      />

      {state && 'error' in state && (
        <p style={{ marginTop: 10, fontSize: 13, color: '#C0392B', fontWeight: 500 }}>{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          width: '100%',
          marginTop: 22,
          background: pending ? '#6B8792' : '#06556E',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          padding: 15,
          fontSize: 15,
          fontWeight: 700,
          fontFamily: 'inherit',
          cursor: pending ? 'default' : 'pointer',
          letterSpacing: '.01em',
          transition: 'transform .12s, background .2s',
        }}
        onMouseEnter={e => { if (!pending) (e.target as HTMLButtonElement).style.background = '#075d79' }}
        onMouseLeave={e => { if (!pending) (e.target as HTMLButtonElement).style.background = '#06556E' }}
      >
        {pending ? 'Accesso in corso…' : 'Accedi'}
      </button>
    </form>
  )
}
