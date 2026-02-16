/**
 * Migration: Alte Abo-Namen → Variante B (Standard · Starter · Partner · Premium)
 * Führe aus mit: npx tsx prisma/migrate-abo-status.ts
 *
 * Mapping:
 *   standard → standard (unverändert)
 *   premium  → starter
 *   gold     → premium (Top-Tier)
 *   pending  → pending (unverändert)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // premium → starter
  const r1 = await prisma.makler.updateMany({
    where: { status: 'premium' },
    data: { status: 'starter' },
  })

  // gold → premium
  const r2 = await prisma.makler.updateMany({
    where: { status: 'gold' },
    data: { status: 'premium' },
  })

  console.log(`Migration abgeschlossen: ${r1.count} premium→starter, ${r2.count} gold→premium`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
