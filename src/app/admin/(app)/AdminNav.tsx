'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import styles from './Admin.module.css'

export default function AdminNav() {
  const path = usePathname()

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarInner}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>FM</span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>FIMMG Sardegna</span>
            <span className={styles.brandMeta}>Pannello admin</span>
          </span>
        </div>
        <form action={logout}>
          <button type="submit" className={styles.logout}>
            Esci
          </button>
        </form>
      </div>
      <nav className={styles.nav}>
        {[
          { href: '/admin/utenti',      label: 'Utenti' },
          { href: '/admin/convenzioni', label: 'Convenzioni' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.navLink} ${path.startsWith(href) ? styles.navLinkActive : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
