'use client'

import { useEffect, useRef, useState, useCallback, startTransition } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { generateQrToken } from '@/app/actions/qr'
import { logout } from '@/app/actions/auth'

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

// ─── Orologio live ────────────────────────────────────────────────────────────

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

const GIORNI = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']
const MESI   = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre']

function pad(n: number) { return String(n).padStart(2, '0') }

// ─── Componente principale ────────────────────────────────────────────────────

export default function TesseraClient({ username, conventions, baseUrl }: Props) {
  const [tab, setTab] = useState<'tessera' | 'convenzioni'>('tessera')
  const [qrUrl, setQrUrl] = useState<string>('')
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('Tutte')
  const now = useClock()
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Genera token QR iniziale e poi ogni 50s
  const refreshQr = useCallback(() => {
    startTransition(async () => {
      try {
        const token = await generateQrToken()
        setQrUrl(`${baseUrl}/verifica?t=${token}`)
      } catch {
        // silenzioso: il QR scaduto sarà rifiutato al momento della scansione
      }
    })
  }, [baseUrl])

  useEffect(() => {
    refreshQr()
    refreshTimer.current = setInterval(refreshQr, 50_000)
    return () => { if (refreshTimer.current) clearInterval(refreshTimer.current) }
  }, [refreshQr])

  // Tag unici per i filtri
  const allTags = ['Tutte', ...Array.from(new Set(conventions.flatMap(c => c.tags))).sort()]

  // Filtro convenzioni
  const filtered = conventions.filter(c => {
    const matchTag = activeTag === 'Tutte' || c.tags.includes(activeTag)
    const q = search.toLowerCase()
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.benefitText.toLowerCase().includes(q)
    return matchTag && matchSearch
  })

  const clockStr = now
    ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    : '--:--:--'
  const dateStr = now
    ? `${GIORNI[now.getDay()]} ${now.getDate()} ${MESI[now.getMonth()]} ${now.getFullYear()}`
    : '—'

  return (
    <div className="min-h-dvh flex flex-col bg-paper">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-paper">
        <div className="flex items-center gap-2.5">
          <span className="text-[15px] font-extrabold tracking-tight text-petrol">FIMMG</span>
          <span className="text-[10px] font-bold tracking-[.16em] uppercase text-amber-deep">Sardegna</span>
        </div>
        <form action={logout}>
          <button type="submit" className="text-[12px] font-semibold text-muted cursor-pointer bg-none border-none">
            Esci
          </button>
        </form>
      </header>

      {/* Contenuto tab */}
      <main className="flex-1 overflow-y-auto hide-scrollbar">
        {tab === 'tessera' && (
          <div className="tab-fade px-4 pb-6">
            {/* Badge card */}
            <div className="relative rounded-[26px] px-6 pt-6 pb-5 text-white overflow-hidden mt-3"
              style={{ background: 'linear-gradient(158deg, #0a6180 0%, #06556E 46%, #043D50 100%)', boxShadow: '0 26px 50px -22px rgba(4,61,80,.85)' }}>

              {/* Overlay pattern */}
              <div className="absolute inset-0 pointer-events-none" style={{
                opacity: .5,
                background: 'radial-gradient(60% 40% at 85% 8%, rgba(245,166,50,.18), transparent 60%), repeating-linear-gradient(115deg, rgba(255,255,255,.035) 0 2px, transparent 2px 22px)'
              }} />

              {/* Top row: logo + chip */}
              <div className="relative flex justify-between items-start">
                <img src="/logo-white.png" alt="FIMMG Sardegna" className="w-36" />
                <span className="font-mono text-[10px] tracking-[.12em] bg-white/[.14] border border-white/[.22] px-2.5 py-1 rounded-full whitespace-nowrap">
                  {username}
                </span>
              </div>

              {/* QR */}
              <div className="relative mx-auto mt-5 mb-1.5 w-[186px] h-[186px] bg-white rounded-[20px] flex items-center justify-center"
                style={{ boxShadow: '0 10px 26px -10px rgba(0,0,0,.5)' }}>
                {qrUrl ? (
                  <QRCodeSVG value={qrUrl} size={158} level="M" />
                ) : (
                  <div className="w-[158px] h-[158px] bg-[#EDF1F2] rounded animate-pulse" />
                )}
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber text-[#3a2a05] text-[9px] font-extrabold tracking-[.14em] px-3 py-1 rounded-full uppercase whitespace-nowrap">
                  Inquadra per verificare
                </span>
              </div>

              {/* Sigillo live */}
              <div className="mt-6 mx-auto max-w-[290px] text-center border-t border-dashed border-white/[.28] pt-4">
                <div className="flex items-center justify-center gap-2 text-[11px] tracking-[.18em] font-bold uppercase text-[#cfe6ee]">
                  <span className="w-[9px] h-[9px] rounded-full bg-amber pulse-dot inline-block" />
                  Tessera valida in questo momento
                </div>
                <div className="font-mono text-[30px] font-semibold tracking-[.02em] mt-2"
                  style={{ fontVariantNumeric: 'tabular-nums', textShadow: '0 2px 10px rgba(0,0,0,.25)' }}>
                  {clockStr}
                </div>
                <div className="font-mono text-[12px] text-[#bcd6df] mt-0.5 tracking-[.06em]">{dateStr}</div>
              </div>
            </div>

            {/* Hint verifica */}
            <p className="mt-4 text-[12px] text-muted text-center leading-relaxed px-2">
              L'orario che scorre dimostra che la tessera è autentica e non uno screenshot.
              Al commerciante basta la fotocamera del telefono — nessuna app richiesta.
            </p>

            {/* Privacy footer */}
            <div className="flex items-center justify-center gap-2 mt-5 text-[11px] text-muted text-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Nessun dato personale è mostrato o memorizzato nell'app.
            </div>
          </div>
        )}

        {tab === 'convenzioni' && (
          <div className="tab-fade px-4 pb-6">
            <h2 className="text-[23px] font-extrabold tracking-tight mt-3 mb-0.5 text-ink">Convenzioni attive</h2>
            <p className="text-[13px] text-muted mb-4">Mostra la tua tessera presso le attività aderenti.</p>

            {/* Ricerca */}
            <div className="relative mb-3.5">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9db4bc" strokeWidth="2">
                <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cerca un'attività…"
                className="w-full bg-white border border-line rounded-[13px] pl-10 pr-4 py-3 text-[14px] text-ink placeholder:text-muted outline-none focus:border-petrol transition"
              />
            </div>

            {/* Filtri tag */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3.5">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`flex-shrink-0 text-[11px] font-bold tracking-[.05em] uppercase px-3 py-1.5 rounded-full transition cursor-pointer ${
                    activeTag === tag
                      ? 'bg-petrol text-white'
                      : 'bg-white border border-line text-muted'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Lista convenzioni */}
            {filtered.length === 0 ? (
              <p className="text-center text-muted text-[14px] py-8">Nessuna convenzione trovata.</p>
            ) : (
              filtered.map(c => (
                <div key={c.id} className="bg-white border border-line rounded-[16px] px-4 py-4 mb-2.5 transition hover:-translate-y-0.5 hover:shadow-md">
                  <p className="text-[16px] font-bold tracking-tight text-ink mb-2">{c.name}</p>
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {c.tags.map(t => (
                      <span key={t} className="text-[10.5px] font-bold tracking-[.05em] uppercase px-2 py-1 rounded-[7px] bg-petrol/10 text-petrol">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-[13.5px] text-[#4a6470] leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: c.benefitText }} />
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Tab bar */}
      <nav className="flex bg-white border-t border-line"
        style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom))' }}>
        <TabButton
          active={tab === 'tessera'}
          onClick={() => setTab('tessera')}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="3"/>
              <circle cx="9" cy="10" r="2"/>
              <path d="M14 9h4M14 13h4M6 16h12"/>
            </svg>
          }
          label="Tessera"
        />
        <TabButton
          active={tab === 'convenzioni'}
          onClick={() => setTab('convenzioni')}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h10"/>
            </svg>
          }
          label="Convenzioni"
        />
      </nav>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-0.5 pt-2 pb-1.5 text-[11px] font-semibold transition cursor-pointer border-none bg-none ${
        active ? 'text-petrol' : 'text-muted'
      }`}
    >
      {icon}
      {label}
      {active && <span className="w-1 h-1 rounded-full bg-amber" />}
    </button>
  )
}
