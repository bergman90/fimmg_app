"use client"

import { useEffect, useRef, useState, useCallback, startTransition } from "react"
import { QRCodeSVG } from "qrcode.react"
import { generateQrToken } from "@/app/actions/qr"
import { logout } from "@/app/actions/auth"
import styles from "./TesseraClient.module.css"

interface Convention {
  id: string
  name: string
  benefitText: string
  tags: string[]
}

interface Props {
  username: string
  conventions: Convention[]
  baseUrl: string
}

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

const GIORNI = ["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"]
const MESI   = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"]
const pad = (n: number) => String(n).padStart(2, "0")

export default function TesseraClient({ username, conventions, baseUrl }: Props) {
  const [tab, setTab] = useState<"tessera" | "convenzioni">("tessera")
  const [qrUrl, setQrUrl] = useState<string>("")
  const [search, setSearch] = useState("")
  const [activeTag, setActiveTag] = useState("Tutte")
  const now = useClock()
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const refreshQr = useCallback(() => {
    startTransition(async () => {
      try {
        const token = await generateQrToken()
        setQrUrl(`${baseUrl}/verifica?t=${token}`)
      } catch {
        // silenzioso
      }
    })
  }, [baseUrl])

  useEffect(() => {
    refreshQr()
    refreshTimer.current = setInterval(refreshQr, 50_000)
    return () => { if (refreshTimer.current) clearInterval(refreshTimer.current) }
  }, [refreshQr])

  const allTags = ["Tutte", ...Array.from(new Set(conventions.flatMap(c => c.tags))).sort()]

  const filtered = conventions.filter(c => {
    const matchTag = activeTag === "Tutte" || c.tags.includes(activeTag)
    const q = search.toLowerCase()
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.benefitText.toLowerCase().includes(q)
    return matchTag && matchSearch
  })

  const clockStr = now ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` : "--:--:--"
  const dateStr  = now ? `${GIORNI[now.getDay()]} ${now.getDate()} ${MESI[now.getMonth()]} ${now.getFullYear()}` : "—"

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandName}>FIMMG</span>
          <span className={styles.brandRegion}>Sardegna</span>
        </div>
        <form action={logout}>
          <button type="submit" className={styles.logout}>Esci</button>
        </form>
      </header>

      <main className={styles.main}>
        {tab === "tessera" && (
          <div className={styles.page}>
            <div className={styles.badge}>
              <div className={styles.badgeTop}>
                <img src="/logo-white.png" alt="FIMMG Sardegna" className={styles.badgeLogo} />
                <span className={styles.chip}>{username}</span>
              </div>

              <div className={styles.qrWrap}>
                {qrUrl
                  ? <QRCodeSVG value={qrUrl} size={158} level="M" />
                  : <div style={{ width:158, height:158, background:"#EDF1F2", borderRadius:6 }} />}
              </div>
              <span className={styles.qrTag}>Inquadra per verificare</span>

              <div className={styles.seal}>
                <div className={styles.sealLabel}>
                  <span className={styles.pulse} />
                  Tessera valida in questo momento
                </div>
                <div className={styles.clock}>{clockStr}</div>
                <div className={styles.date}>{dateStr}</div>
              </div>
            </div>

            <p className={styles.hint}>
              L&apos;orario che scorre dimostra che la tessera è autentica e non uno screenshot.
              Al commerciante basta la fotocamera del telefono — nessuna app richiesta.
            </p>

            <div className={styles.privacy}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Nessun dato personale è mostrato o memorizzato nell&apos;app.
            </div>
          </div>
        )}

        {tab === "convenzioni" && (
          <div className={styles.page}>
            <h2 className={styles.pageTitle}>Convenzioni attive</h2>
            <p className={styles.pageSub}>Mostra la tua tessera presso le attività aderenti.</p>

            <div className={styles.search}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9db4bc" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cerca un'attività…"
              />
            </div>

            <div className={styles.filters}>
              {allTags.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={`${styles.fpill} ${activeTag === t ? styles.fpillActive : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className={styles.empty}>Nessuna convenzione trovata.</p>
            ) : (
              filtered.map(c => (
                <div key={c.id} className={styles.conv}>
                  <p className={styles.convName}>{c.name}</p>
                  <div className={styles.tags}>
                    {c.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                  </div>
                  <p className={styles.benefit} dangerouslySetInnerHTML={{ __html: c.benefitText }} />
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <nav className={styles.tabbar}>
        <button onClick={() => setTab("tessera")} className={`${styles.tab} ${tab === "tessera" ? styles.tabActive : ""}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="M14 9h4M14 13h4M6 16h12" />
          </svg>
          Tessera
          <span className={styles.tabDot} />
        </button>
        <button onClick={() => setTab("convenzioni")} className={`${styles.tab} ${tab === "convenzioni" ? styles.tabActive : ""}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h10" />
          </svg>
          Convenzioni
          <span className={styles.tabDot} />
        </button>
      </nav>
    </div>
  )
}
