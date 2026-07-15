import { NextRequest } from 'next/server'
import { verifyQrToken } from '@/lib/qr'
import { db } from '@/lib/db'

// Colori dal design system FIMMG
const COLOR_PETROLIO = '#06556E'
const COLOR_AMBER    = '#F5A632'
const COLOR_BG       = '#EDF1F2'
const COLOR_TEXT     = '#0A2A34'
const COLOR_RED      = '#C0392B'
const COLOR_GREEN    = '#1A7A4A'

function htmlPage(
  title: string,
  valid: boolean,
  message: string,
): Response {
  const badgeColor  = valid ? COLOR_GREEN    : COLOR_RED
  const badgeLabel  = valid ? '✓ VALIDO'     : '✗ NON VALIDO'
  const badgeBg     = valid ? '#D4EDDA'      : '#F8D7DA'

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — FIMMG Sardegna</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: ${COLOR_BG};
      color: ${COLOR_TEXT};
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 4px 24px rgba(6,85,110,.12);
      padding: 2.5rem 2rem;
      max-width: 360px;
      width: 100%;
      text-align: center;
    }
    .logo {
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: .08em;
      color: ${COLOR_PETROLIO};
      text-transform: uppercase;
      margin-bottom: 1.5rem;
    }
    .badge {
      display: inline-block;
      background: ${badgeBg};
      color: ${badgeColor};
      border: 2px solid ${badgeColor};
      border-radius: 2rem;
      font-size: 1.4rem;
      font-weight: 800;
      padding: .6rem 2rem;
      margin-bottom: 1rem;
      letter-spacing: .04em;
    }
    .message {
      font-size: .95rem;
      color: #6B8792;
      line-height: 1.5;
    }
    .footer {
      margin-top: 2rem;
      font-size: .75rem;
      color: #6B8792;
    }
    .dot {
      display: inline-block;
      width: .5rem;
      height: .5rem;
      background: ${COLOR_AMBER};
      border-radius: 50%;
      margin-right: .4rem;
      vertical-align: middle;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">FIMMG Sardegna</div>
    <div class="badge">${badgeLabel}</div>
    <p class="message">${message}</p>
    <div class="footer">
      <span class="dot"></span>Verifica automatica · ${new Date().toLocaleTimeString('it-IT')}
    </div>
  </div>
</body>
</html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Nessuna cache: ogni scansione deve fare una verifica fresca
      'Cache-Control': 'no-store',
    },
  })
}

export async function GET(request: NextRequest): Promise<Response> {
  const token = request.nextUrl.searchParams.get('t')

  if (!token) {
    return htmlPage(
      'Verifica non valida',
      false,
      'Link di verifica mancante o non corretto.',
    )
  }

  const result = await verifyQrToken(token)

  if (!result.valid) {
    const message =
      result.reason === 'expired'
        ? 'Il codice QR è scaduto. Chiedere all\'iscritto di aggiornare la tessera.'
        : 'Codice QR non valido. Contattare l\'associazione.'
    return htmlPage('Verifica non valida', false, message)
  }

  // Controlla che l'utente esista e sia ancora attivo
  const user = await db.user.findUnique({
    where: { id: result.userId },
    select: { active: true },
  })

  if (!user || !user.active) {
    return htmlPage(
      'Iscrizione non attiva',
      false,
      'Questo iscritto non risulta attivo. Contattare l\'associazione.',
    )
  }

  return htmlPage(
    'Iscritto valido',
    true,
    'Iscrizione FIMMG Sardegna verificata e attiva.',
  )
}
