@AGENTS.md

# FIMMG App — Contesto per Claude Code

## Progetto
App web PWA per la gestione degli iscritti di FIMMG Sardegna (sindacato medici).
Repo: https://github.com/bergman90/fimmg_app.git — cartella locale: `C:\Users\blasf\Documents\fimmg_app`

## Stack
- **Next.js** (TypeScript, App Router, `src/` dir, alias `@/*`)
- **Prisma** + **PostgreSQL** (Neon, free tier, region Frankfurt EU)
- **Hosting**: Render (app, region Frankfurt EU)
- **Hashing**: argon2id (via `argon2`)
- **Validazione**: zod

## File di riferimento fondamentali
- `HANDOFF.md` — stato del progetto, task rimanenti, changelog sessioni. **Leggere sempre all'inizio di ogni sessione. Aggiornare obbligatoriamente alla fine di ogni sessione con: data e ora, modifiche apportate, prossime fasi.**
- `docs/fimmg-app-brief.md` — brief originale con tutti i requisiti.
- `docs/fimmg-prototipo.html` — fonte di verità per l'aspetto visivo (apri nel browser per vedere il riferimento pixel-perfect).
- `docs/assets/fimmg-logo-color.png` — logo FIMMG a colori.
- `prisma/schema.prisma` — modello dati completo.

## Vincoli sempre attivi
- **Zero dati personali**: niente nome, email, foto. Solo username anonimi, hash password, token, stato iscrizione.
- Password **solo hashate** (argon2id), mai in chiaro.
- Token invito e QR: monouso/a scadenza breve.
- HTTPS obbligatorio, hosting e DB in UE (Frankfurt).
- Nessuna registrazione autonoma: solo l'admin crea gli account.

## Workflow Git
```bash
git add <files>
git commit -m "messaggio"
git push
```
Commit e push **solo su richiesta esplicita dell'utente**.

## Note ambiente
- Node.js v24.18.0 installato sul PC dell'utente.
- `C:\Users\blasf` è una repo git separata e non correlata — non toccarla.
- `.env` non è nella repo (in `.gitignore`) — contiene `DATABASE_URL` per Neon.
