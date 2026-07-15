/**
 * Sanitizza l'HTML del campo benefitText.
 * L'unico tag consentito è <b>...</b> — tutto il resto viene rimosso.
 * Usato prima di salvare nel DB, così il dato a riposo è già sicuro.
 */
export function sanitizeBenefitText(raw: string): string {
  return (
    raw
      // 1. Rimuove tutti i tag tranne <b> e </b>
      .replace(/<(?!\/?b\s*>)[^>]+>/gi, '')
      // 2. Rimuove attributi da <b> (es. <b class="x">)
      .replace(/<b\s[^>]*>/gi, '<b>')
      // 3. Riduce spazi multipli
      .replace(/\s{2,}/g, ' ')
      .trim()
  )
}
