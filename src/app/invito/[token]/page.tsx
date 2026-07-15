import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import RedeemForm from './RedeemForm'

interface Props {
  params: Promise<{ token: string }>
}

export default async function InvitoPage({ params }: Props) {
  const { token } = await params

  const invite = await db.inviteToken.findUnique({
    where: { token },
    include: { user: { select: { username: true } } },
  })

  if (!invite || invite.usedAt !== null || invite.expiresAt < new Date()) {
    notFound()
  }

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-8"
      style={{ background: 'radial-gradient(120% 90% at 50% -10%, #0a6685 0%, #06556E 42%, #043D50 100%)' }}>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo-color.png" alt="FIMMG Sardegna" className="w-48" />
        </div>

        <div className="bg-white rounded-[22px] border border-[#DCE6E9] shadow-[0_14px_40px_-22px_rgba(4,61,80,.5)] px-6 py-7">
          <h1 className="text-[19px] font-bold tracking-tight text-[#0A2A34] mb-0.5">Benvenuto</h1>
          <p className="text-[13px] text-[#6B8792] mb-1 leading-[1.4]">
            Il tuo nome utente è:
          </p>
          <p className="font-mono text-[15px] font-semibold text-[#06556E] mb-5">
            {invite.user.username}
          </p>
          <p className="text-[13px] text-[#6B8792] mb-5 leading-[1.4]">
            Scegli una password per accedere alla tua tessera.
          </p>
          <RedeemForm token={token} />
        </div>
      </div>
    </main>
  )
}
