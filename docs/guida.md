# FIMMG Sardegna — Guida completa

Questa guida spiega come mettere online l'app e come usarla, sia come **amministratore** che come **iscritto**.

---

## Indice

1. [Prima configurazione (una volta sola)](#1-prima-configurazione)
2. [Deploy su Render](#2-deploy-su-render)
3. [Creare il primo account admin](#3-creare-il-primo-account-admin)
4. [Usare il pannello admin](#4-usare-il-pannello-admin)
5. [Esperienza dell'iscritto](#5-esperienza-delliscritto)
6. [Verifica QR da parte del commerciante](#6-verifica-qr)
7. [Operazioni di manutenzione](#7-manutenzione)

---

## 1. Prima configurazione

### Cosa ti serve

- Un computer con il terminale aperto nella cartella del progetto (`fimmg_app`)
- Account **GitHub** — per mantenere il codice online
- Account **Neon** (database) — già configurato
- Account **Render** (hosting) — da creare al momento del deploy

### Variabili d'ambiente (file `.env`)

Il file `.env` nella cartella del progetto contiene le credenziali sensibili.
**Non condividerlo mai e non caricarlo su GitHub** (è già escluso automaticamente).

Deve contenere:

```
DATABASE_URL="postgresql://..."        ← la connection string di Neon
SESSION_SECRET="..."                   ← stringa casuale lunga (già generata)
NEXT_PUBLIC_BASE_URL="https://..."     ← l'URL dell'app su Render (da aggiornare dopo il deploy)
```

---

## 2. Deploy su Render

### 2a. Carica il codice su GitHub

Prima di tutto, assicurati che il codice sia su GitHub:

```
git add .
git commit -m "versione iniziale"
git push
```

### 2b. Crea l'account Render

1. Vai su **https://render.com** e clicca **Get Started for Free**
2. Registrati con GitHub (più comodo)
3. Clicca **New +** → **Web Service**
4. Collega il repository GitHub `fimmg_app`

### 2c. Configura il servizio

Compila i campi come segue:

| Campo | Valore |
|-------|--------|
| **Name** | `fimmg-sardegna` |
| **Region** | `Frankfurt (EU Central)` |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### 2d. Aggiungi le variabili d'ambiente su Render

Nel pannello Render, vai su **Environment** e aggiungi:

| Chiave | Valore |
|--------|--------|
| `DATABASE_URL` | la connection string di Neon |
| `SESSION_SECRET` | la stessa stringa del tuo `.env` locale |
| `NEXT_PUBLIC_BASE_URL` | `https://fimmg-sardegna.onrender.com` (o il tuo URL Render) |
| `NODE_ENV` | `production` |

> **Nota:** l'URL esatto lo trovi nella dashboard Render dopo aver creato il servizio.

### 2e. Avvia il deploy

Clicca **Create Web Service**. Render scarica il codice, lo compila e lo mette online.
Il primo deploy richiede 3–5 minuti.

Quando vedi **"Your service is live"**, l'app è online.

> **Attenzione — cold start:** il piano gratuito di Render mette il server in pausa dopo 15 minuti di inattività. La prima visita dopo una pausa può richiedere 20–50 secondi. È normale e gratuito. Se vuoi eliminare questo inconveniente, passa al piano a pagamento ($7/mese).

### 2f. Aggiorna NEXT_PUBLIC_BASE_URL nel .env locale

Apri il file `.env` nella cartella del progetto e aggiorna la riga:

```
NEXT_PUBLIC_BASE_URL="https://il-tuo-url.onrender.com"
```

Questo serve per generare i link di invito corretti anche quando lavori in locale.

---

## 3. Creare il primo account admin

Lo script va eseguito **una volta sola**, dalla cartella del progetto sul tuo computer.

```
npm run seed-admin
```

Lo script chiede:
- **Username admin** — scegli quello che preferisci (es. `admin.fimmg`)
- **Password** — almeno 12 caratteri, non viene mostrata mentre scrivi
- **Conferma password**

Al termine stampa un messaggio di conferma. Le credenziali sono salvate hashate nel database — nessuno può vederle in chiaro, nemmeno te.

> Se vuoi creare l'account admin direttamente su Render (senza eseguirlo in locale), puoi usare la Shell di Render: vai su **Shell** nel pannello del servizio e digita `npm run seed-admin`.

---

## 4. Usare il pannello admin

### Accesso

Vai su `https://il-tuo-url.onrender.com/admin/login` e inserisci le credenziali create con lo script seed.

### 4a. Gestione utenti

La sezione **Utenti** mostra tutti gli iscritti.

#### Creare un nuovo iscritto

1. Clicca **+ Nuovo iscritto**
2. L'app genera automaticamente:
   - Un **username anonimo** (es. `FIMMG-SARD-4837`)
   - Un **link di invito** valido 72 ore
3. Clicca **Copia** accanto al link
4. Invia il link all'iscritto tramite il canale che preferisci (email, WhatsApp, ecc.)

> L'app non conosce né memorizza email o numeri di telefono. Il collegamento "username ↔ persona reale" resta nei tuoi registri, fuori dall'app.

#### Disattivare / riattivare un iscritto

Nella riga dell'utente, clicca **Disattiva** o **Riattiva**.
Un account disattivato non può fare login e la sua tessera QR risulta "NON VALIDA" se già emessa.

#### Rigenerare il link di invito

Se l'iscritto ha perso il link o è scaduto (72h), clicca **Rigenera link**.
Il vecchio link viene invalidato automaticamente e viene creato un nuovo link valido 72 ore.
Copialo e invialo nuovamente all'iscritto.

### 4b. Gestione convenzioni

La sezione **Convenzioni** mostra le attività convenzionate.

#### Aggiungere una convenzione

Compila il form in alto:
- **Nome attività** — es. `Farmacia Centrale`
- **Testo beneficio** — descrizione del vantaggio. Puoi usare `<b>testo</b>` per il grassetto. Es: `<b>10%</b> su tutti i farmaci da banco.`
- **Tag** — categorie separate da virgola. Es: `Salute, Professionale`. I tag vengono creati automaticamente se non esistono.

Clicca **Aggiungi**.

#### Modificare una convenzione

Clicca **Modifica** sulla convenzione, cambia i campi, clicca **Aggiorna**.

#### Disattivare / eliminare una convenzione

- **Disattiva** — la nasconde agli iscritti senza eliminarla. Utile per convenzioni temporaneamente sospese.
- **Riattiva** — la rende nuovamente visibile.
- **Elimina** — rimozione permanente (chiede conferma).

---

## 5. Esperienza dell'iscritto

### 5a. Primo accesso (via link di invito)

1. L'iscritto riceve il link di invito (es. `https://...onrender.com/invito/abc123...`)
2. Apre il link nel browser del telefono
3. Viene mostrato il suo **username** (es. `FIMMG-SARD-4837`) e un campo per scegliere la password
4. Imposta la password (minimo 8 caratteri) e clicca **Imposta password e accedi**
5. Viene portato direttamente alla **tessera**

> Il link scade dopo 72 ore. Se l'iscritto non lo usa in tempo, l'admin può rigenerarne uno nuovo.

### 5b. Accessi successivi

1. Vai su `https://...onrender.com/login`
2. Inserisci username (es. `FIMMG-SARD-4837`) e password
3. Clicca **Accedi**

### 5c. La tessera (schermata principale)

La tessera mostra:
- Il **logo FIMMG** su sfondo petrolio
- Il **codice iscritto** (es. `FIMMG-SARD-4837`) — non identificativo, nessun dato personale
- Un **QR code** che si aggiorna ogni 50 secondi automaticamente
- Il **sigillo live**: data e ora correnti che scorrono ogni secondo con pallino ambra pulsante — prova che la tessera è autentica e non uno screenshot

**Come mostrare la tessera al commerciante:**
Mostra semplicemente la schermata del telefono. Il commerciante può:
- Guardare il sigillo live (orario che scorre) — verifica visiva immediata
- Scansionare il QR con la fotocamera del telefono per una verifica digitale

### 5d. Le convenzioni

Tocca la tab **Convenzioni** in basso per vedere le attività convenzionate.
- Usa il **campo di ricerca** per cercare per nome o descrizione
- Usa i **filtri tag** (Salute, Sport, ecc.) per filtrare per categoria

### 5e. Installare l'app sul telefono (PWA)

L'app si può installare come se fosse un'app nativa:
- **iPhone/iPad**: apri Safari → tocca il pulsante condividi → "Aggiungi alla schermata Home"
- **Android**: apri Chrome → tocca i tre puntini → "Aggiungi alla schermata Home" o "Installa app"

Una volta installata, l'app si apre senza barra del browser e funziona offline per la schermata tessera (il QR non sarà aggiornabile offline, ma il sigillo live e i dati dell'iscritto restano visibili dalla cache).

---

## 6. Verifica QR

Il commerciante convenzionato può verificare la tessera **senza installare nessuna app**:

1. Apre la fotocamera del telefono
2. Inquadra il QR sulla tessera dell'iscritto
3. Tocca il link che appare automaticamente
4. Vede una pagina semplice con:
   - **✓ VALIDO** — tessera attiva e autentica
   - **✗ NON VALIDO** — tessera scaduta, non autentica, o iscritto disattivato

Il QR è valido per **60 secondi** dalla sua generazione. L'app lo aggiorna ogni 50 secondi in automatico, quindi la tessera è sempre fresca.

> La pagina di verifica non mostra mai dati personali — solo l'esito.

---

## 7. Manutenzione

### Aggiornare l'app

Ogni volta che modifichi il codice in locale:

```
git add .
git commit -m "descrizione modifica"
git push
```

Render rileva automaticamente il push e rideploya l'app in 2–3 minuti.

### Backup del database

Neon esegue backup automatici giornalieri sul piano gratuito (conservati 7 giorni).
Per un backup manuale, vai sulla dashboard Neon → **Branches** → **Restore**.

### Cambiare la password admin

Usa di nuovo lo script seed per creare un nuovo account admin con una password diversa, poi elimina il vecchio dalla dashboard Neon (tabella `admins`) se necessario.

### Reset password di un iscritto

L'admin non può vedere né reimpostare direttamente la password di un iscritto.
Il modo corretto è: clicca **Rigenera link** sulla riga dell'utente → invia il nuovo link all'iscritto → l'iscritto sceglie una nuova password aprendo il link.

### Problemi comuni

| Problema | Soluzione |
|----------|-----------|
| L'app è lenta al primo carico | Cold start del piano gratuito Render — normale, aspetta 20–50s |
| Link di invito "non valido" | Scaduto (72h) o già usato — rigenera dal pannello admin |
| QR "scaduto" durante la verifica | L'iscritto deve aprire la tessera e aspettare l'aggiornamento automatico (max 50s) |
| Iscritto non riesce ad accedere | Controlla che l'account sia attivo nel pannello admin |
| Tessera mostra "NON VALIDA" al QR | Account disattivato dall'admin |

---

*Guida aggiornata al 15 luglio 2026 — FIMMG Sardegna*
