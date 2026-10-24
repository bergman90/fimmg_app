import { db } from '@/lib/db'
import { listAvailableDocumentFiles } from '@/lib/documents'
import { listDocumentFolders } from '@/app/actions/admin'
import DocumentList from './DocumentList'
import DocumentForm from './DocumentForm'
import styles from '../Admin.module.css'

export default async function DocumentiPage() {
  const [documents, availableFiles, folders] = await Promise.all([
    db.document.findMany({ orderBy: [{ folder: 'asc' }, { createdAt: 'desc' }] }),
    listAvailableDocumentFiles(),
    listDocumentFolders(),
  ])
  const activeCount = documents.filter(d => d.active).length

  return (
    <div>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.kicker}>Documentazione</p>
          <h1 className={styles.title}>Documenti</h1>
          <p className={styles.subtitle}>
            {activeCount} visibili · {documents.length} totali
          </p>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Collega documento</h2>
              <p className={styles.panelHint}>
                I file PDF/Word vanno caricati nel repository (chiedi allo sviluppatore);
                qui si assegnano titolo e cartella.
              </p>
            </div>
          </div>
          <div className={styles.panelBody}>
            <DocumentForm availableFiles={availableFiles} folders={folders} />
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Elenco documenti</h2>
              <p className={styles.panelHint}>
                Organizzati per cartella. Nascondi o rimuovi quelli non più validi.
              </p>
            </div>
          </div>
          <div className={styles.panelBody}>
            <DocumentList
              documents={documents.map(d => ({
                id: d.id,
                title: d.title,
                filename: d.filename,
                folder: d.folder,
                active: d.active,
              }))}
              folders={folders}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
