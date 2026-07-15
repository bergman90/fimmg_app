import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const session = await getSession()
  if (session?.role === 'user') redirect('/tessera')
  if (session?.role === 'admin') redirect('/admin')

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-[30px] py-8 bg-paper">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <img
          src="/logo-color.png"
          alt="FIMMG Sardegna"
          className="w-[210px] block mx-auto mb-[30px]"
        />

        {/* Card */}
        <div className="bg-white border border-[#DCE6E9] rounded-[22px] px-[22px] pt-[24px] pb-[26px]"
          style={{ boxShadow: '0 14px 40px -22px rgba(4,61,80,.5)' }}>
          <h1 className="text-[19px] font-bold tracking-[-0.02em] text-ink mb-[2px]">Accedi alla tua tessera</h1>
          <p className="text-[13px] text-muted mb-[20px] leading-[1.4]">
            Riservato agli iscritti FIMMG Sardegna.
          </p>
          <LoginForm />

          {/* Nota — dentro la card come nel prototipo */}
          <div className="flex gap-[9px] items-start mt-[20px] px-[14px] py-[12px] rounded-xl text-[12px] leading-[1.45]"
            style={{ background: 'rgba(6,85,110,.06)', color: '#4a6c78' }}>
            <svg className="flex-shrink-0 mt-[1px]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            Gli account sono creati dall'associazione. Per assistenza contatta la segreteria FIMMG Sardegna.
          </div>
        </div>

      </div>
    </main>
  )
}
