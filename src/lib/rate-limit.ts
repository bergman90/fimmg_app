/**
 * Rate limiter in-memory semplice.
 * Adatto a un'app piccola con pochi utenti — nessun Redis richiesto.
 * Reset automatico ogni finestra di tempo.
 */

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

// Pulizia periodica per evitare memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 60_000)

/**
 * Controlla se la chiave (es. IP) ha superato il limite.
 * @param key      Identificatore (IP, username, …)
 * @param limit    Numero massimo di tentativi
 * @param windowMs Finestra temporale in millisecondi
 * @returns `true` se il limite è stato superato
 */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  entry.count++
  if (entry.count > limit) return true
  return false
}
