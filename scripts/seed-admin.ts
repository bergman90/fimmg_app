/**
 * Script da eseguire UNA SOLA VOLTA per creare il primo account admin.
 *
 * Utilizzo:
 *   npm run seed-admin
 *
 * Lo script chiede username e password in modo interattivo.
 * Le credenziali NON vengono mai memorizzate in chiaro.
 */

import 'dotenv/config'
import * as readline from 'readline'
import * as argon2 from 'argon2'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// ─── Prisma client diretto (senza il singleton Next.js) ─────────────────────
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('Errore: DATABASE_URL non trovato nel file .env')
  process.exit(1)
}
const adapter = new PrismaPg({ connectionString })
const db = new PrismaClient({ adapter })

// ─── Lettura interattiva da terminale ────────────────────────────────────────
function prompt(question: string, hidden = false): Promise<string> {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    if (hidden) {
      // Nasconde l'input per la password
      process.stdout.write(question)
      process.stdin.setRawMode?.(true)
      let input = ''
      process.stdin.resume()
      process.stdin.setEncoding('utf8')
      process.stdin.on('data', function handler(char: string) {
        if (char === '\r' || char === '\n') {
          process.stdin.setRawMode?.(false)
          process.stdin.removeListener('data', handler)
          process.stdout.write('\n')
          rl.close()
          resolve(input)
        } else if (char === '\u0003') {
          process.exit()
        } else if (char === '\u007f') {
          if (input.length > 0) input = input.slice(0, -1)
        } else {
          input += char
        }
      })
    } else {
      rl.question(question, answer => {
        rl.close()
        resolve(answer.trim())
      })
    }
  })
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n=== Creazione account admin FIMMG ===\n')

  // Controlla se esiste già un admin
  const existing = await db.admin.count()
  if (existing > 0) {
    console.log(`⚠️  Esiste già ${existing} account admin nel database.`)
    const confirm = await prompt('Vuoi crearne un altro? (s/N): ')
    if (confirm.toLowerCase() !== 's') {
      console.log('Operazione annullata.')
      await db.$disconnect()
      process.exit(0)
    }
  }

  const username = await prompt('Username admin: ')
  if (!username || username.length < 3) {
    console.error('Errore: username troppo corto (minimo 3 caratteri)')
    await db.$disconnect()
    process.exit(1)
  }

  const password = await prompt('Password (min 12 caratteri): ', true)
  if (password.length < 12) {
    console.error('Errore: password troppo corta (minimo 12 caratteri)')
    await db.$disconnect()
    process.exit(1)
  }

  const confirm = await prompt('Conferma password: ', true)
  if (password !== confirm) {
    console.error('Errore: le password non coincidono')
    await db.$disconnect()
    process.exit(1)
  }

  console.log('\nCreazione in corso…')

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  })

  // Controlla che l'username non sia già in uso
  const exists = await db.admin.findUnique({ where: { username } })
  if (exists) {
    console.error(`Errore: l'username "${username}" è già in uso.`)
    await db.$disconnect()
    process.exit(1)
  }

  await db.admin.create({ data: { username, passwordHash } })

  console.log(`\n✅ Account admin creato con successo!`)
  console.log(`   Username: ${username}`)
  console.log(`   Accedi su: /admin/login\n`)

  await db.$disconnect()
}

main().catch(err => {
  console.error('Errore imprevisto:', err)
  process.exit(1)
})
