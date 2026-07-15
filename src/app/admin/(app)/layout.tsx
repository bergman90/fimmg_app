import { requireAdmin } from '@/lib/auth'
import AdminNav from './AdminNav'
import styles from './Admin.module.css'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return (
    <div className={styles.shell}>
      <AdminNav />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
