# FIMMG Sardegna — App iscritti: stato del progetto

> **Istruzioni per Claude**: a ogni ripresa del lavoro, leggi prima la sezione
> "Stato attuale", poi in fondo trovi il changelog completo delle sessioni
> precedenti. Quando finisci una sessione (o l'utente deve interrompere),
> aggiorna "Stato attuale" e aggiungi una nuova voce in fondo al changelog
> con data e ora.

## Stato attuale (ultimo aggiornamento: 2026-07-15 20:21)

- **Stack scelto**: Next.js (TypeScript, App Router) + Prisma + PostgreSQL.
- **Hosting scelto**: Render (app, free tier, region Frankfurt/EU) + Neon
  (Postgres, free tier, region Frankfurt/EU). Vedi rationale nel changelog
  sotto — Scalingo era la prima scelta ma scartata per costo.
- **Riferimenti di progetto** (copiati anche in questa repo):
  - [`docs/fimmg-app-brief.md`](docs/fimmg-app-brief.md) — brief originale, requisiti completi.
  - [`docs/fimmg-prototipo.html`](docs/fimmg-prototipo.html) — **fonte di verità per l'aspetto** (colori, tessera, orologio vivo, lista convenzioni). Aprilo nel browser per vedere il riferimento pixel-perfect.
  - [`docs/assets/fimmg-logo-color.png`](docs/assets/fimmg-logo-color.png) — logo a colori. La versione bianca per la tessera è ora in `public/logo-white.png`.
- **Repo git**: dedicata a questo progetto, collegata a `https://github.com/bergman90/fimmg_app.git`, branch `main`. (La cartella utente Windows `C:\Users\blasf` risulta essere *anche lei* una repo git a sé, probabilmente per errore — non è collegata a questo progetto, non toccarla.)

### Fatto finora
- Scaffold Next.js in questa cartella (TypeScript, ESLint, Tailwind, App Router, `src/` dir, alias `@/*`).
- Installate dipendenze: `prisma`, `@prisma/client`, `argon2`, `zod`, `jose`, `@prisma/adapter-pg`, `dotenv`.
- Prisma 7 configurato con `prisma.config.ts` (breaking change: URL non più nel `schema.prisma` ma nel config file + adapter obbligatorio).
- Scritto **`prisma/schema.prisma`** con il modello dati completo: `User`, `InviteToken`, `Convention`, `Tag`, `Admin`.
- **Database Neon** creato (region Frankfurt EU), migration `init` applicata — tabelle attive.
- `.env` con `DATABASE_URL`, `SESSION_SECRET` (32 byte random), `NEXT_PUBLIC_BASE_URL`.
- **Backend auth completo** (`src/lib/` + `src/app/actions/`):
  - `db.ts` — Prisma singleton con `PrismaPg` adapter
  - `session.ts` — JWT cookie HttpOnly 8h via `jose`
  - `auth.ts` — `requireUser()` / `requireAdmin()` guard con redirect
  - `rate-limit.ts` — rate limiter in-memory (5 tentativi / 15 min per IP)
  - `actions/auth.ts` — Server Actions: `loginUser`, `loginAdmin`, `logout` (argon2id, anti-timing attack)
  - `actions/invite.ts` — Server Actions: `createInvite`, `regenerateInvite`, `redeemInvite`

### Da fare nella prossima sessione

#### UI (può farlo Claude normale — solo JSX/HTML/CSS, niente da eseguire)
- [x] **Tessera** — layout aggiornato con `TesseraClient.module.css` e loghi FIMMG forniti.
- [x] **Admin login** — aggiornata con grafica coerente al resto dell'app.

#### Asset (richiede file dall'associazione o da creare)
- [x] **Logo bianco** — sostituito `public/logo-white.png` con il file fornito dall'associazione.
- [x] **Icone PWA** — aggiunte `public/icons/icon-192.png`, `public/icons/icon-512.png` e `public/apple-touch-icon.png`.

#### Contenuti (dipende dall'associazione)
- [ ] **Pagina privacy** — testo da ricevere dall'associazione (brief sezione 8).

#### Già fatto e funzionante
- ✅ App deployata su Render: https://fimmg-app.onrender.com
- ✅ DB Neon configurato e migrato
- ✅ Login page aggiornata al prototipo con wrapper device e CSS module dedicato
- ✅ Flusso completo funzionante: login → tessera → QR → verifica → convenzioni
- ✅ Pannello admin aggiornato: login admin, navigazione, utenti, convenzioni e tag con grafica coerente
- ✅ Security headers, rate limiting, sanitizzazione HTML
- ✅ Anteprima link social/WhatsApp configurata con logo FIMMG (`public/social-preview.png`)

## Task rimanenti (ordine suggerito dal brief, sezione 10)

1. ~~Scaffolding progetto (Next.js + Prisma)~~ — **fatto**.
2. ~~**Backend auth**~~ — **fatto**: login iscritti/admin (argon2id, anti-timing, rate limit), sessioni JWT cookie, link invito monouso 24h, riscatto con scelta password.
3. ~~**Endpoint verifica QR**~~ — **fatto**: token JWT 60s (`src/lib/qr.ts`), Server Action `generateQrToken`, route pubblica `/verifica?t=...` con HTML "VALIDO / NON VALIDO" (nessun dato personale esposto).
4. ~~**Frontend PWA**~~ — **fatto**: login, tessera (orologio live, QR auto-refresh 50s, sigillo ambra), convenzioni (ricerca + filtri tag), invito con scelta password, service worker offline, manifest PWA. Fedele al prototipo HTML. Testato: tutte le route rispondono correttamente.
5. ~~**Pannello admin**~~ — **fatto**: login admin separato, gestione utenti (crea+link, disattiva/riattiva, rigenera link), gestione convenzioni (CRUD, attiva/disattiva, tag CSV). Route group `(app)` per separare login dal layout protetto.
6. ~~**Hardening sicurezza**~~ — **fatto**: security header HTTP (`next.config.ts`), middleware edge JWT (`src/middleware.ts`), sanitizzazione HTML `benefitText` (`src/lib/sanitize.ts`). Argon2id cost già corretto nelle sessioni precedenti.
3. **Endpoint verifica QR**: token firmato lato server a scadenza breve (~60s), endpoint `/verifica?...` che risponde "iscritto valido / non valido", nessun dato personale esposto.
4. **Frontend PWA** fedele al prototipo: login, tessera (orologio vivo, QR, sigillo pulsante ambra), convenzioni (ricerca + filtri tag generati automaticamente) + manifest + service worker per funzionamento offline della sola schermata tessera.
5. **Pannello admin**: utenti (crea → username+link, disattiva/riattiva, rigenera link), convenzioni (CRUD, attiva/disattiva), tag liberi digitati dall'admin.
6. **Hardening sicurezza**: security header, rate limiting, cost argon2id, log minimi senza dati personali, backup cifrati (lato Neon) + pagina informativa privacy.
7. **Istruzioni di deploy** passo-passo per utente non tecnico (Render + Neon), scritte in modo semplice e a prova di principiante.

## Vincoli importanti da rispettare sempre

- **Nessun dato personale nell'app**, mai: niente nome, email, foto. Solo username anonimi, hash password, token, stato iscrizione, convenzioni. Il collegamento persona↔username resta fuori dall'app (registri dell'associazione).
- Password **solo hashate** (argon2id), mai in chiaro, mai visibili all'admin.
- Token di invito e di verifica QR: **monouso/a scadenza breve**.
- HTTPS obbligatorio, hosting e DB in UE (region Frankfurt su Render/Neon).
- Nessuna registrazione autonoma: solo l'admin crea gli account.

## Changelog

### 2026-07-15 20:21 — Sessione 14 (link invito 24h)

**Modifiche apportate:**
- `src/app/actions/invite.ts` — portata la durata dei nuovi link invito da 72 ore a 24 ore.
- `src/app/admin/(app)/utenti/CreateUserButton.tsx` — aggiornata la modale admin: ora indica "Scade in 24h".
- `docs/guida.md`, `docs/fimmg-app-brief.md`, `HANDOFF.md` — aggiornati i riferimenti documentali da 72h a 24h.

**Verifica:**
- Verificato con `rg` che non restino riferimenti reali a "72h" o "72 ore" nel codice e nei documenti utili.
- `npm.cmd run lint` completato con successo. Restano 2 warning non bloccanti sugli `<img>` in `src/app/invito/[token]/page.tsx` e `src/app/tessera/TesseraClient.tsx`.
- `npm.cmd run build` completato con successo. Resta solo il warning non bloccante del driver Postgres su `sslmode`.

**Nota operativa:**
- I link gia generati mantengono la scadenza salvata nel database. I nuovi link e quelli rigenerati useranno 24 ore.

---

### 2026-07-15 20:19 — Sessione 13 (restyling admin)

**Modifiche apportate:**
- `src/app/admin/(app)/Admin.module.css` — aggiunto CSS module condiviso per shell admin, topbar, navigazione, pannelli, liste, form, modali, badge e stati responsive.
- `src/app/admin/(app)/layout.tsx` e `AdminNav.tsx` — aggiornati layout protetto e navigazione admin con identita visiva FIMMG.
- `src/app/admin/(app)/utenti/` — aggiornata la pagina iscritti, con statistiche, card ordinate, modal di creazione link e azioni utente piu chiare.
- `src/app/admin/(app)/convenzioni/` — aggiornata la gestione convenzioni con form, lista, modifica inline, tag e stati visivi coerenti.
- `src/app/admin/login/` — aggiornata la pagina login admin con CSS module dedicato.
- `src/app/tessera/TesseraClient.tsx` — sistemato `useClock` per soddisfare la regola lint React 19 senza cambiare comportamento.

**Verifica:**
- `npm.cmd run lint` completato con successo. Restano 2 warning non bloccanti sugli `<img>` in `src/app/invito/[token]/page.tsx` e `src/app/tessera/TesseraClient.tsx`.
- `npm.cmd run build` completato con successo. Resta solo il warning non bloccante del driver Postgres su `sslmode`.

**Prossime fasi:**
- Commit/push delle modifiche admin quando richiesto dall'utente.
- Eventuale sostituzione degli `<img>` residui con `next/image` per azzerare anche i warning lint.
- Preparare pagina privacy quando l'associazione fornisce il testo.

---

### 2026-07-15 19:58 — Sessione 12 (PWA icons + link preview)

**Modifiche apportate:**
- `public/social-preview.png` — aggiunta immagine Open Graph 1200x630 con logo FIMMG Sardegna.
- `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/apple-touch-icon.png` — aggiunte icone PWA/home screen generate dal logo fornito.
- `src/app/layout.tsx` — aggiunti `metadataBase`, Open Graph, Twitter card e icone app.
- `src/app/manifest.ts` — aggiornato manifest PWA con `id` e icone maskable.

**Verifica:**
- `npm.cmd run build` completato con successo. Resta solo il warning non bloccante del driver Postgres su `sslmode`.
- Verificato localmente che `/login` emetta riferimenti `og:image`, `twitter:image`, manifest e apple touch icon.
- Verificato localmente che `/social-preview.png` e `/icons/icon-192.png` rispondano 200.

**Prossime fasi:**
- Preparare pagina privacy quando l'associazione fornisce il testo.
- Valutare se rifinire anche il login admin.

---

### 2026-07-15 19:47 — Sessione 11 (login device prototype)

**Modifiche apportate:**
- `src/app/login/page.tsx` — aggiornata la pagina login al nuovo riferimento `fimmg-prototipo_1.html`: sfondo petrolio radiale, wrapper device, statusbar/notch, logo e card centrata.
- `src/app/login/LoginForm.tsx` — rimosso lo styling inline e collegato al CSS module.
- `src/app/login/Login.module.css` — aggiunto CSS module con misure e stati del prototipo, più vincoli responsive per schermi piccoli.

**Verifica:**
- `npm.cmd run build` completato con successo. Resta solo il warning non bloccante del driver Postgres su `sslmode`.

**Prossime fasi:**
- Aggiungere icone PWA `public/icons/icon-192.png` e `public/icons/icon-512.png`.
- Preparare pagina privacy quando l'associazione fornisce il testo.
- Valutare se rifinire anche il login admin.

---

### 2026-07-15 19:32 — Sessione 10 (layout tessera + loghi FIMMG)

**Modifiche apportate:**
- `src/app/tessera/TesseraClient.tsx` — sostituito con la versione fornita dall'utente, con import `./TesseraClient.module.css` e logo caricato da `/logo-white.png`.
- `src/app/tessera/TesseraClient.module.css` — aggiunto CSS module dedicato per il layout della tessera.
- `public/logo-white.png` e `public/logo-color.png` — sostituiti con i file forniti.
- Verificato che non esistano riferimenti o file al vecchio logo circolare.

**Verifica:**
- `npm.cmd run build` completato con successo. Resta solo il warning non bloccante del driver Postgres su `sslmode`.

**Prossime fasi:**
- Aggiungere icone PWA `public/icons/icon-192.png` e `public/icons/icon-512.png`.
- Preparare pagina privacy quando l'associazione fornisce il testo.
- Valutare se rifinire anche il login admin.

---

### 2026-07-15 18:30 — Sessione 9 (login pixel-perfect + handoff)

**Modifiche apportate:**
- `src/app/login/page.tsx` — riscritto con CSS inline copiato 1:1 dal prototipo. Struttura identica: sfondo paper, logo 210px, card con shadow corretta, nota con icona lucchetto e testo esatto del prototipo.
- `src/app/login/LoginForm.tsx` — riscritto con CSS inline: label `margin:14px 0 6px`, field `padding:13px 14px` IBM Plex Mono, button `padding:15px`, focus/hover gestiti via onFocus/onBlur.

**Stato app:** funzionante e deployata. Login visivamente identico al prototipo.

**Prossime fasi:** vedi sezione "Da fare" sopra. UI tessera/convenzioni può essere fatta con Claude normale (solo JSX/HTML, niente da eseguire).

---

### 2026-07-15 18:00 — Sessione 8 (UI layout fix)

**Modifiche apportate:**
- `src/app/login/page.tsx` — sfondo cambiato da gradient petrolio a `bg-paper`, logo 210px, nota informativa spostata dentro la card, testo titolo/sottotitolo allineati al prototipo ("Accedi alla tua tessera" / "Riservato agli iscritti FIMMG Sardegna.").
- `src/app/login/LoginForm.tsx` — label con `margin: 14px 0 6px` (come prototipo, anche la prima), field padding `13px 14px`, button `margin-top: 22px`.
- `src/app/tessera/TesseraClient.tsx` — molti fix layout per aderire al prototipo pixel-perfect:
  - Header: `padding: 20px 22px 6px`
  - Tabpage: `padding: 8px 18px 26px`
  - Sigillo: `margin-top: 22px`
  - Verify hint: `margin-top: 18px`, `line-height: 1.5`
  - Conv page-title: `letter-spacing: -0.025em`, `margin: 14px 4px 2px`
  - Filtri tag (fpill): `font-size: 12px`, `font-weight: 600`, `padding: 7px 14px`, rimosse uppercase/tracking
  - Conv card: `padding-bottom: 15px`, `margin: 0 4px 11px`, `box-shadow` corretta
  - Conv name: `letter-spacing: -0.01em`, `margin-bottom: 9px`
  - Tabbar: `padding: 8px 8px calc(8px + env(safe-area-inset-bottom))`
  - Amberdot: sempre nel DOM, opacity toggled via CSS (come prototipo)

**Prossime fasi:**
- [ ] Testare su mobile (iOS Safari + Android Chrome) per verificare safe-area-inset.
- [ ] Sostituire `public/logo-white.png` con versione bianca ufficiale del logo FIMMG.
- [ ] Aggiungere icone PWA (`public/icons/icon-192.png`, `public/icons/icon-512.png`).
- [ ] Testare la pagina `/invito/[token]` (stile con gradient petrolio — verificare se l'utente è soddisfatto o preferisce stile diverso).

---

### 2026-07-15 17:10 — Sessione 7 (hardening sicurezza)

**Modifiche apportate:**
- `next.config.ts` — security headers su tutte le route: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` (solo prod), `Content-Security-Policy` (con `unsafe-eval` solo in dev per Turbopack).
- `src/middleware.ts` — middleware edge: verifica JWT cookie prima che la richiesta arrivi alle pagine. Protegge `/tessera` (solo utenti), `/admin/*` eccetto `/admin/login` (solo admin). Redirect automatico se già loggato.
- `src/lib/sanitize.ts` — `sanitizeBenefitText()`: strip di tutti i tag HTML tranne `<b>`. Applicata in `createConvention` e `updateConvention` prima del salvataggio nel DB.
- Testato: `/tessera` → 307 senza sessione, `/admin/utenti` → 307 senza sessione, `/login` → 200, tutti i 5 security header presenti nella risposta.

**Prossime fasi:**
- L'app è pronta per il deploy. Seguire `docs/guida.md` sezione 2 (Deploy su Render).
- Eseguire `npm run seed-admin` prima o dopo il deploy per creare il primo admin.
- Sostituire i placeholder logo/icone PWA.

---

### 2026-07-15 16:40 — Sessione 6 (seed admin + guida)

**Modifiche apportate:**
- `scripts/seed-admin.ts` — script interattivo per creare il primo account admin. Eseguire con `npm run seed-admin`. Chiede username e password da terminale, hash argon2id, salva nel DB. Controlla duplicati e minimo 12 caratteri per la password.
- `docs/guida.md` — guida completa in italiano: deploy Render, configurazione variabili, creazione admin, uso pannello admin (utenti + convenzioni), esperienza iscritto (invito, login, tessera, convenzioni, PWA installabile), verifica QR da commerciante, manutenzione e troubleshooting.
- Aggiunto script `seed-admin` in `package.json`.
- Installato `tsx` come devDependency per eseguire script TypeScript.

**Prossime fasi:**
- Task #6: hardening sicurezza (security header HTTP in `next.config.ts`, sanificazione HTML benefitText lato server).
- Deploy: `npm run seed-admin` → `git push` → configurare Render.

---

### 2026-07-15 16:10 — Sessione 5 (pannello admin)

**Modifiche apportate:**
- `src/app/actions/admin.ts` — `setUserActive`, `createConvention`, `updateConvention`, `toggleConvention`, `deleteConvention` (tutte con `requireAdmin` guard).
- `src/app/admin/login/` — pagina login admin (fuori dal layout protetto).
- `src/app/admin/(app)/layout.tsx` — layout protetto con `requireAdmin` + `AdminNav`.
- `src/app/admin/(app)/AdminNav.tsx` — barra navigazione con tab Utenti/Convenzioni + logout.
- `src/app/admin/(app)/utenti/` — lista utenti, creazione con modal (username + link copiabile), disattiva/riattiva, rigenera link.
- `src/app/admin/(app)/convenzioni/` — lista + form aggiungi, modifica inline, toggle attiva, elimina con conferma. Tag in formato CSV.
- Struttura route group `(app)` per separare `/admin/login` (pubblico) dalle pagine protette.
- Testato: `/admin/login` → 200, `/admin` → 307 redirect login (senza sessione).

**Prossime fasi:**
- Task #6: hardening sicurezza (security header HTTP, sanificazione HTML nei benefitText, log minimi, cost argon2id verificato).
- Task #7: guida deploy passo-passo per Render + Neon (per utente non tecnico).
- Prima del deploy: creare l'account admin iniziale (script seed o via API).

---

### 2026-07-15 15:30 — Sessione 4 (frontend PWA)

**Modifiche apportate:**
- `src/app/layout.tsx` — Inter + IBM Plex Mono via `next/font`, metadata PWA, viewport theme-color petrolio, `SwRegister`.
- `src/app/globals.css` — design system FIMMG in variabili Tailwind v4 (`--color-petrol`, `--color-amber`, ecc.), animazioni `pulse-dot` e `fade-in`.
- `src/app/page.tsx` — redirect root → `/tessera` o `/login` secondo sessione.
- `src/app/manifest.ts` — manifest PWA (Next.js file convention).
- `src/app/login/page.tsx` + `LoginForm.tsx` — pagina login con `useActionState`, stile identico al prototipo.
- `src/app/invito/[token]/page.tsx` + `RedeemForm.tsx` — pagina riscatto invito con validazione token server-side e scelta password.
- `src/app/invito/[token]/not-found.tsx` — pagina 404 per link scaduti/invalidi.
- `src/app/tessera/page.tsx` — Server Component: `requireUser`, fetch user + convenzioni attive dal DB.
- `src/app/tessera/TesseraClient.tsx` — Client Component: tab tessera/convenzioni, orologio live (1s), QR auto-refresh ogni 50s via `generateQrToken`, filtri tag, ricerca testo.
- `src/components/SwRegister.tsx` — registra service worker lato client.
- `public/sw.js` — service worker network-first con cache tessera per offline.
- `public/logo-color.png` — logo copiato da `docs/assets/`.
- `public/logo-white.png` — placeholder (= logo a colori). Da sostituire con versione bianca ufficiale.
- Testato: `/` → redirect `/login` (307), `/login` → 200, `/tessera` → redirect `/login` (non autenticato), `/verifica?t=invalid` → 200 NON VALIDO, `/invito/inesistente` → 404.

**Prossime fasi:**
- Task #5: pannello admin (gestione utenti, convenzioni, tag).
- Sostituire `logo-white.png` con versione ufficiale bianca appena disponibile.
- Aggiungere icone PWA (192px, 512px) per installazione app.

---

### 2026-07-15 14:50 — Sessione 3 (endpoint verifica QR)

**Modifiche apportate:**
- `src/lib/qr.ts` — `signQrToken(userId)` (JWT 60s) e `verifyQrToken(token)`.
- `src/app/actions/qr.ts` — Server Action `generateQrToken()` (richiede sessione utente, da chiamare ogni ~50s dalla tessera).
- `src/app/verifica/route.ts` — Route Handler GET pubblico: verifica token, controlla `user.active`, restituisce pagina HTML "VALIDO / NON VALIDO" con design FIMMG. Nessun dato personale esposto. `Cache-Control: no-store`.

**Prossime fasi:**
- Task #4: frontend PWA — login, tessera (orologio live, QR auto-refresh ogni 50s, sigillo ambra), convenzioni (ricerca + filtri tag). Fedele al prototipo HTML.

---

### 2026-07-15 14:30 — Sessione 2 (Neon + backend auth)

**Modifiche apportate:**
- Creato account Neon (region Frankfurt EU), migration `init` applicata — tabelle live.
- Risolto breaking change Prisma 7: rimossa `url` da `schema.prisma`, aggiunta a `prisma.config.ts`; installato `@prisma/adapter-pg` (ora obbligatorio).
- Installato `jose` per JWT, `dotenv` per `prisma.config.ts`.
- Creati `src/lib/db.ts`, `session.ts`, `auth.ts`, `rate-limit.ts`.
- Creati `src/app/actions/auth.ts` (loginUser, loginAdmin, logout) e `actions/invite.ts` (createInvite, regenerateInvite, redeemInvite).
- Aggiunto `SESSION_SECRET` e `NEXT_PUBLIC_BASE_URL` al `.env`.
- TypeScript compila senza errori.

**Prossime fasi:**
- Task #3: endpoint verifica QR (token firmato ~60s, route `/verifica`).
- Task #4: frontend PWA (login, tessera con orologio live + QR, convenzioni) — fedele al prototipo HTML.

---

### 2026-07-15 12:50 — Sessione 1 (avvio progetto)

- Letto il brief (`docs/fimmg-app-brief.md`) e il prototipo di riferimento (`docs/fimmg-prototipo.html`) forniti dall'utente in `Downloads`.
- Discussa e decisa l'architettura con l'utente:
  - **Stack**: Next.js + Prisma + PostgreSQL. Motivazione: un solo progetto per frontend+backend (niente due deploy da sincronizzare), libreria/documentazione più ricca per auth/PWA/hashing rispetto alle alternative valutate (SvelteKit, Node/Express + vanilla JS).
  - **Hosting**: proposto inizialmente Scalingo (PaaS francese, azienda 100% EU) — l'utente lo ha giudicato **troppo costoso** e ha chiesto di fermarsi. Si è passati a una combinazione **gratuita**: Render (app, region Frankfurt) + Neon (Postgres, region Frankfurt). Nota importante: sono aziende USA con data center in EU, non aziende EU-native — accettabile perché l'app, per design, non tratta alcun dato personale. Limite noto da comunicare sempre all'utente: cold start di ~20-50s su Render free dopo un periodo di inattività.
- Installato Node.js v24.18.0 sul PC dell'utente (non era presente prima).
- Rilevato che `C:\Users\blasf` (l'intera cartella utente Windows) è una repo git a sé stante, quasi certamente non intenzionale — non toccata. Creata invece una repo git dedicata dentro `fimmg_app/`.
- Creato lo scaffold Next.js con `create-next-app` (TypeScript, ESLint, Tailwind CSS, App Router, `src/` dir, alias `@/*`).
- Installate dipendenze `prisma`, `@prisma/client`, `argon2`, `zod`; approvati gli script di installazione bloccati da npm (`allow-scripts`) per `prisma`/`argon2`/`sharp`/`unrs-resolver`; eseguito `npm rebuild`.
- Inizializzato Prisma e scritto `prisma/schema.prisma` con il modello dati completo (`User`, `InviteToken`, `Convention`, `Tag`, `Admin`) secondo il brief sezione 7.
- Interrotta la configurazione del database locale (`npx prisma dev`) su richiesta dell'utente per fine sessione da questa postazione.
- Copiati in `docs/` i file di riferimento (brief, prototipo HTML, logo a colori) così restano disponibili nella repo indipendentemente dalla cartella `Downloads` locale.
- Collegata la repo locale a `https://github.com/bergman90/fimmg_app.git` (branch `main`) e fatto il primo push, come richiesto dall'utente prima di interrompere la sessione.

---

Prossima sessione: riparti da "Da fare prima/durante la prossima sessione" sopra, poi procedi con il **Task #2** (backend auth).
