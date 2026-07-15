import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const session = await getSession()
  if (session?.role === 'user') redirect('/tessera')
  if (session?.role === 'admin') redirect('/admin')

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-8"
      style={{ background: 'radial-gradient(120% 90% at 50% -10%, #0a6685 0%, #06556E 42%, #043D50 100%)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo-color.png" alt="FIMMG Sardegna" className="w-48 mb-1" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-[22px] border border-[#DCE6E9] shadow-[0_14px_40px_-22px_rgba(4,61,80,.5)] px-6 py-7">
          <h1 className="text-[19px] font-bold tracking-tight text-[#0A2A34] mb-0.5">Accedi</h1>
          <p className="text-[13px] text-[#6B8792] mb-5 leading-[1.4]">
            Inserisci le credenziali fornite dall'associazione.
          </p>
          <LoginForm />
        </div>

        {/* Nota */}
        <div className="mt-4 flex gap-2.5 items-start bg-white/10 rounded-xl px-3.5 py-3 text-[12px] text-white/75 leading-[1.45]">
          <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
          </svg>
          Gli account sono creati dall'associazione. Per assistenza contatta la segreteria FIMMG Sardegna.
        </div>
      </div>
    </main>
  )
}
