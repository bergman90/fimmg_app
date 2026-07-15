import { redirect } from 'next/navigation'
import { getSession } from './session'

/**
 * Da usare nei Server Components/Actions che richiedono un iscritto autenticato.
 * Redirige a /login se la sessione non è valida.
 */
export async function requireUser() {
  const session = await getSession()
  if (!session || session.role !== 'user') redirect('/login')
  return session
}

/**
 * Da usare nei Server Components/Actions del pannello admin.
 * Redirige a /admin/login se la sessione non è valida.
 */
export async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'admin') redirect('/admin/login')
  return session
}
