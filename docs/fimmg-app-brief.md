# FIMMG Sardegna — App iscritti · Brief di progetto

Questo documento descrive l'app da costruire. Nella stessa cartella trovi
`fimmg-prototipo.html`: **usalo come riferimento visivo esatto** (colori, tessera,
orologio vivo, lista convenzioni). Il prototipo è la fonte di verità per l'aspetto.

---

## 1. Cosa fa l'app (in una frase)

Permette agli iscritti FIMMG Sardegna di mostrarsi come tali presso le attività
convenzionate e di consultare l'elenco delle convenzioni attive. Nient'altro.

## 2. Tipo di applicazione

- **PWA** (Progressive Web App) installabile su iOS e Android e apribile da browser.
- Deve funzionare **offline** per la sola schermata tessera (service worker + cache).
- Aggiornabile senza passare dagli app store.

## 3. Schermate lato iscritto

Tre viste, fedeli al prototipo:

1. **Login** — solo nome utente + password. Nessuna registrazione autonoma.
   Messaggio: "Gli account sono creati dall'associazione".
2. **Tessera** — logo FIMMG (versione bianca su sfondo petrolio), QR code,
   e il "sigillo vivo": data e ora correnti che scorrono ogni secondo con
   pallino ambra pulsante. Mostra un **codice non identificativo** (es.
   `FIMMG-SARD-4837`). **Nessun dato personale** (niente nome, foto, tessera).
3. **Convenzioni** — elenco con: nome attività, tag (categorie), testo breve del
   beneficio. In cima: campo di ricerca + filtri per tag. I filtri si generano
   automaticamente dai tag presenti.

## 4. Modello di autenticazione (importante)

- **Nessuna registrazione autonoma.** Solo l'admin crea gli account.
- Alla creazione, il sistema genera:
  - uno **username non identificativo** (es. `FIMMG-SARD-####`);
  - un **link di invito monouso a scadenza** (es. 72h).
- L'admin **inoltra il link** all'iscritto sul proprio canale (email/WhatsApp);
  l'app **non memorizza email né contatti**.
- Aprendo il link, l'iscritto **sceglie da sé la password**. La password
  non viaggia mai in chiaro e non è mai visibile all'admin.
- Password salvate **solo come hash** (argon2id, oppure bcrypt cost ≥ 12).
- L'admin può **disattivare/riattivare** un account in qualsiasi momento
  (validità altrimenti indefinita). Un account disattivato mostra tessera "NON VALIDA".
- **Reset password**: gestito dall'admin generando un nuovo link monouso.

## 5. Autenticità della tessera

- La tessera si mostra **solo a utente autenticato**.
- Elemento anti-screenshot: **timestamp live** (orario che scorre) — è sufficiente
  per un controllo visivo da parte del commerciante.
- Il **QR** contiene un **token firmato lato server a scadenza breve** (es. 60s),
  con endpoint di verifica `/verifica?...` che risponde "iscritto valido / non valido".
  Il commerciante usa la **fotocamera nativa** del telefono: nessuna app richiesta.

## 6. Pannello admin (lato tuo)

Interfaccia protetta (login admin separato) per:

- **Utenti**: creare account → genera username + link monouso da copiare;
  disattivare / riattivare; rigenerare link (reset).
- **Convenzioni**: aggiungere / modificare / rimuovere una convenzione
  (nome, tag, testo beneficio). Attivare/disattivare una convenzione.
- **Tag**: liberi e personalizzabili; l'admin li scrive digitando.

## 7. Modello dati (minimo)

- `users`: id, username, password_hash, stato (attivo/disattivo), creato_il.
  **Nessun** campo con dati personali (no nome, no email).
- `invite_tokens`: token, user_id, scadenza, usato (bool).
- `conventions`: id, nome, testo_beneficio, attiva (bool), creata_il.
- `convention_tags` / `tags`: relazione molti-a-molti tra convenzioni e tag.
- `admins`: id, username, password_hash.

## 8. Privacy e sicurezza (requisiti vincolanti)

- **Nessun dato personale nell'app**: solo username anonimi, hash password,
  stato iscrizione, token temporanei, convenzioni.
- Il collegamento "username ↔ persona reale" resta **fuori dall'app**, nei registri
  dell'associazione (titolare del trattamento: FIMMG Sardegna).
- **HTTPS obbligatorio**; hosting e database **in UE**.
- Password **solo hashate**; token monouso e a scadenza; rate limiting sul login.
- Log minimi, senza dati personali. Backup del database cifrati.
- Predisporre pagina **informativa privacy** (testo fornito dall'associazione).

## 9. Stile visivo

- Colori: petrolio `#06556E`, ambra `#F5A632`, sfondo chiaro `#EDF1F2`,
  testo `#0A2A34`, secondario `#6B8792`.
- Font: **Inter** (UI) + **IBM Plex Mono** (orologio e codici).
- Logo: fornito in due versioni (a colori su chiaro, bianco su petrolio).
- Riferimento pixel: `fimmg-prototipo.html`.

## 10. Ordine di costruzione suggerito

1. Scaffolding progetto (PWA + backend + DB) con lo stack che ritieni più semplice
   da mantenere e da ospitare in UE.
2. Backend: auth iscritti, auth admin, generazione token invito, endpoint verifica QR.
3. Frontend PWA fedele al prototipo (login, tessera, convenzioni) + service worker offline.
4. Pannello admin (utenti, convenzioni, tag).
5. Hardening sicurezza (rate limit, header, hashing) + pagina informativa privacy.
6. Istruzioni di deploy passo-passo per un utente non tecnico.

> Nota per chi costruisce: l'utente non è uno sviluppatore. Preferisci uno stack
> semplice, con deploy su una piattaforma gestita in UE, e scrivi istruzioni di
> messa online chiare e a prova di principiante.
