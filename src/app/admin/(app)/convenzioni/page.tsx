import { db } from '@/lib/db'
import ConventionList from './ConventionList'
import ConventionForm from './ConventionForm'
import styles from '../Admin.module.css'

export default async function ConvenzioniPage() {
  const conventions = await db.convention.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tags: { select: { name: true } } },
  })
  const activeCount = conventions.filter(c => c.active).length

  return (
    <div>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.kicker}>Archivio vantaggi</p>
          <h1 className={styles.title}>Convenzioni</h1>
          <p className={styles.subtitle}>
            {activeCount} attive · {conventions.length} totali
          </p>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Aggiungi convenzione</h2>
              <p className={styles.panelHint}>
                Inserisci nome, beneficio e tag separati da virgola.
              </p>
            </div>
          </div>
          <div className={styles.panelBody}>
            <ConventionForm mode="create" />
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Elenco convenzioni</h2>
              <p className={styles.panelHint}>
                Modifica, sospendi o rimuovi le convenzioni visibili agli iscritti.
              </p>
            </div>
          </div>
          <div className={styles.panelBody}>
            <ConventionList
              conventions={conventions.map(c => ({
                id: c.id,
                name: c.name,
                benefitText: c.benefitText,
                active: c.active,
                tags: c.tags.map(t => t.name),
              }))}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
