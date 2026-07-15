# FIMMG Sardegna — App iscritti: stato del progetto

> **Istruzioni per Claude**: a ogni ripresa del lavoro, leggi prima la sezione
> "Stato attuale", poi in fondo trovi il changelog completo delle sessioni
> precedenti. Quando finisci una sessione (o l'utente deve interrompere),
> aggiorna "Stato attuale" e aggiungi una nuova voce in fondo al changelog
> con data e ora.

## Stato attuale (ultimo aggiornamento: 2026-07-15 12:50)

- **Stack scelto**: Next.js (TypeScript, App Router) + Prisma + PostgreSQL.
- **Hosting scelto**: Render (app, free tier, region Frankfurt/EU) + Neon
  (Postgres, free tier, region Frankfurt/EU). Vedi rationale nel changelog
  sotto — Scalingo era la prima scelta ma scartata per costo.
- **Riferimenti di progetto** (copiati anche in questa repo):
  - [`docs/fimmg-app-brief.md`](docs/fimmg-app-brief.md) — brief originale, requisiti completi.
  - [`docs/fimmg-prototipo.html`](docs/fimmg-prototipo.html) — **fonte di verità per l'aspetto** (colori, tessera, orologio vivo, lista convenzioni). Aprilo nel browser per vedere il riferimento pixel-perfect.
  - [`docs/assets/fimmg-logo-color.png`](docs/assets/fimmg-logo-color.png) — logo a colori. **Manca la versione bianca** per lo sfondo petrolio della tessera (il brief la richiede, sezione 9) — può essere derivata automaticamente dal file a colori se non arriva quella ufficiale.
- **Repo git**: dedicata a questo progetto, collegata a `https://github.com/bergman90/fimmg_app.git`, branch `main`. (La cartella utente Windows `C:\Users\blasf` risulta essere *anche lei* una repo git a sé, probabilmente per errore — non è collegata a questo progetto, non toccarla.)

### Fatto finora
- Scaffold Next.js in questa cartella (TypeScript, ESLint, Tailwind, App Router, `src/` dir, alias `@/*`).
- Installate dipendenze: `prisma`, `@prisma/client`, `argon2` (hashing password), `zod` (validazione).
- Approvati gli script di installazione npm per `prisma`/`argon2`/`sharp`/`unrs-resolver` (bloccati di default dalla feature `allow-scripts` di npm) ed eseguito `npm rebuild`.
- Inizializzato Prisma (`prisma init --datasource-provider postgresql`) → creato `prisma/schema.prisma` e `.env` (quest'ultimo **non** è nella repo, è in `.gitignore`).
- Scritto **`prisma/schema.prisma`** con il modello dati completo da brief sezione 7:
  - `User` — username anonimo, password hash (nullable finché non viene scelta), stato attivo/disattivo. **Nessun dato personale.**
  - `InviteToken` — token monouso, scadenza, collegato a uno `User`.
  - `Convention` — nome, testo beneficio, attiva/disattiva.
  - `Tag` — libero, relazione molti-a-molti implicita con `Convention`.
  - `Admin` — username + password hash, separato da `User`.
- Node.js v24.18.0 installato sul PC dell'utente (non era presente).

### Da fare prima/durante la prossima sessione
- [ ] Creare un account **Neon** (https://neon.tech), progetto in region **Frankfurt (EU)**, copiare la connection string in `.env` come `DATABASE_URL`.
- [ ] Eseguire `npx prisma migrate dev --name init` per creare le tabelle sul database.
- [ ] Ottenere dall'associazione il **testo della pagina privacy** (brief sezione 8) — serve prima di pubblicare la pagina informativa.
- [ ] Decidere/produrre la **versione bianca del logo** FIMMG per lo sfondo petrolio.
- [ ] Creare account **Render** (https://render.com) quando il codice sarà pronto per il primo deploy.
- [ ] Continuare dal Task #2 della lista sotto (backend auth).

## Task rimanenti (ordine suggerito dal brief, sezione 10)

1. ~~Scaffolding progetto (Next.js + Prisma)~~ — **fatto**, vedi sopra.
2. **Backend auth**: login iscritti (username + password, argon2id), login admin separato, generazione/redenzione link invito monouso (scadenza 72h, l'iscritto sceglie la password all'apertura del link), rate limiting sul login.
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
