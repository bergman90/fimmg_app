import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL non configurato')
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

// Lazy proxy: il client viene creato solo al primo accesso effettivo,
// non al caricamento del modulo (evita errori durante il build di Next.js).
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createClient()
    }
    return (globalForPrisma.prisma as unknown as Record<string | symbol, unknown>)[prop]
  },
})
