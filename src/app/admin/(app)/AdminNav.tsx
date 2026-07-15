'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'

export default function AdminNav() {
  const path = usePathname()

  return (
    <header className="bg-ink text-white shadow-lg">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <span className="font-extrabold tracking-tight text-[15px]">FIMMG</span>
          <span className="ml-2 text-[10px] font-bold tracking-[.16em] uppercase text-amber">Admin</span>
        </div>
        <form action={logout}>
          <button type="submit" className="text-[12px] font-semibold text-white/60 hover:text-white transition cursor-pointer">
            Esci
          </button>
        </form>
      </div>
      <nav className="max-w-3xl mx-auto px-4 flex gap-1 pb-0">
        {[
          { href: '/admin/utenti',      label: 'Utenti' },
          { href: '/admin/convenzioni', label: 'Convenzioni' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-4 py-2 text-[13px] font-semibold rounded-t-lg transition ${
              path.startsWith(href)
                ? 'bg-[#F0F4F5] text-petrol'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
