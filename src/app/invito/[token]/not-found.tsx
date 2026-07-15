import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-4 text-center"
      style={{ background: 'radial-gradient(120% 90% at 50% -10%, #0a6685 0%, #06556E 42%, #043D50 100%)' }}>
      <div className="bg-white rounded-[22px] px-6 py-8 max-w-sm w-full shadow-xl">
        <p className="text-4xl mb-3">⚠️</p>
        <h1 className="text-[19px] font-bold text-[#0A2A34] mb-2">Link non valido o scaduto</h1>
        <p className="text-[13px] text-[#6B8792] leading-relaxed mb-6">
          Il link di invito che hai usato non è più valido. Contatta la segreteria FIMMG Sardegna per riceverne uno nuovo.
        </p>
        <Link href="/login"
          className="block w-full bg-[#06556E] text-white rounded-xl py-3.5 text-[15px] font-bold text-center">
          Vai al login
        </Link>
      </div>
    </main>
  )
}
