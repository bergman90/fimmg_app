import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import LoginForm from './LoginForm'
import styles from './Login.module.css'

export default async function LoginPage() {
  const session = await getSession()
  if (session?.role === 'user') redirect('/tessera')
  if (session?.role === 'admin') redirect('/admin')

  return (
    <main className={styles.root}>
      <div className={styles.device}>
        <div className={styles.statusbar}>
          <div className={styles.notch} />
        </div>

        <div className={styles.screen}>
          <section className={styles.login} aria-labelledby="login-title">
            <Image
              src="/logo-color.png"
              alt="FIMMG Sardegna"
              width={210}
              height={82}
              priority
              className={styles.logo}
            />

            <div className={styles.card}>
              <h1 id="login-title" className={styles.title}>
                Accedi alla tua tessera
              </h1>
              <p className={styles.subtitle}>
                Riservato agli iscritti FIMMG Sardegna.
              </p>

              <LoginForm />

              <div className={styles.note}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>
                  Non è prevista la registrazione autonoma. Gli account sono creati
                  dall&apos;associazione: se non hai le credenziali, contatta la segreteria.
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
