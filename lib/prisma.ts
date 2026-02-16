import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Verhindert veralteten Cache nach Schema-Änderungen (z.B. neues Eigentuemer-Modell)
const cached = globalForPrisma.prisma
const needsRefresh = cached && typeof (cached as { eigentuemer?: unknown }).eigentuemer === 'undefined'

export const prisma =
  needsRefresh ? new PrismaClient() : (cached ?? new PrismaClient())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
