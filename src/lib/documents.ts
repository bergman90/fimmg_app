import { readdir } from 'node:fs/promises'
import path from 'node:path'

const DOCUMENTS_DIR = path.join(process.cwd(), 'public', 'documenti')
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt'])

/**
 * Elenca i file caricati in public/documenti (i file fisici arrivano via git,
 * non c'è upload da pannello: l'admin si limita a collegare titolo <-> nome file).
 */
export async function listAvailableDocumentFiles(): Promise<string[]> {
  try {
    const entries = await readdir(DOCUMENTS_DIR, { withFileTypes: true })
    return entries
      .filter(e => e.isFile() && ALLOWED_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
      .map(e => e.name)
      .sort((a, b) => a.localeCompare(b, 'it'))
  } catch {
    return []
  }
}

export async function documentFileExists(filename: string): Promise<boolean> {
  const files = await listAvailableDocumentFiles()
  return files.includes(filename)
}
