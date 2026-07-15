import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import AdminLoginForm from './AdminLoginForm'

export default async function AdminLoginPage() {
  const session = await getSession()
  if (session?.role === 'admin') redirect('/admin')

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-8 bg-ink">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold tracking-[.2em] uppercase text-amber mb-1">Pannello admin</p>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">FIMMG Sardegna</h1>
        </div>
        <div className="bg-white rounded-[22px] px-6 py-7 shadow-2xl">
          <p className="text-[13px] text-muted mb-5">Accesso riservato all'amministratore.</p>
          <AdminLoginForm />
        </div>
      </div>
    </main>
  )
}
