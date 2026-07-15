import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import AdminLoginForm from './AdminLoginForm'
import styles from './AdminLogin.module.css'

export default async function AdminLoginPage() {
  const session = await getSession()
  if (session?.role === 'admin') redirect('/admin')

  return (
    <main className={styles.root}>
      <div className={styles.wrap}>
        <div className={styles.brand}>
          <div className={styles.mark}>FM</div>
          <p className={styles.kicker}>Pannello admin</p>
          <h1 className={styles.title}>FIMMG Sardegna</h1>
        </div>

        <section className={styles.card}>
          <p className={styles.intro}>
            Accesso riservato alla segreteria. Da qui si gestiscono iscritti e convenzioni.
          </p>
          <AdminLoginForm />
        </section>
      </div>
    </main>
  )
}
