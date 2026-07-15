import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const session = await getSession()
  if (session?.role === 'user') redirect('/tessera')
  if (session?.role === 'admin') redirect('/admin')

  return (
    <main style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 30px',
      background: '#EDF1F2',
    }}>

      {/* Logo */}
      <img
        src="/logo-color.png"
        alt="FIMMG Sardegna"
        style={{ width: 210, display: 'block', margin: '0 auto 30px' }}
      />

      {/* Card */}
      <div style={{
        background: '#fff',
        border: '1px solid #DCE6E9',
        borderRadius: 22,
        padding: '24px 22px 26px',
        boxShadow: '0 14px 40px -22px rgba(4,61,80,.5)',
      }}>
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.02em', marginBottom: 2, color: '#0A2A34' }}>
          Accedi alla tua tessera
        </div>
        <div style={{ fontSize: 13, color: '#6B8792', marginBottom: 20, lineHeight: 1.4 }}>
          Riservato agli iscritti FIMMG Sardegna.
        </div>

        <LoginForm />

        {/* Nota */}
        <div style={{
          display: 'flex',
          gap: 9,
          alignItems: 'flex-start',
          marginTop: 20,
          padding: '12px 14px',
          background: 'rgba(6,85,110,.06)',
          borderRadius: 12,
          fontSize: 12,
          color: '#4a6c78',
          lineHeight: 1.45,
        }}>
          <svg style={{ flexShrink: 0, marginTop: 1 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4a6c78" strokeWidth="2">
            <rect x="3" y="11" width="18" height="10" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>
            Non è prevista la registrazione autonoma. Gli account sono creati dall'associazione: se non hai le credenziali, contatta la segreteria.
          </span>
        </div>
      </div>

    </main>
  )
}
