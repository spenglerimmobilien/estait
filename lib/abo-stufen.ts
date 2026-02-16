/**
 * Zentrale Abo-Stufen-Konfiguration (Variante B)
 * Standard · Starter · Partner · Premium
 * Verwendung: Karte, Katalog, Profil, Admin, E-Mails
 */

export const ABO_STUFEN = {
  standard: {
    label: 'Standard',
    order: 0,
    color: 'slate',
    price: 0,
    badgeColor: 'bg-slate-100 text-slate-700',
    marker: { size: 8, color: '#64748b', ring: false },
  },
  starter: {
    label: 'Starter',
    order: 1,
    color: 'teal',
    price: 39,
    badgeColor: 'bg-teal-50 text-teal-700',
    marker: { size: 10, color: '#0d9488', ring: true },
  },
  partner: {
    label: 'Partner',
    order: 2,
    color: 'teal',
    price: 99,
    badgeColor: 'bg-teal-100 text-teal-800',
    marker: { size: 12, color: '#0d9488', ring: true },
  },
  premium: {
    label: 'Premium',
    order: 3,
    color: 'amber',
    price: 199,
    badgeColor: 'bg-amber-50 text-amber-700',
    marker: { size: 14, color: '#d97706', ring: true },
  },
  pending: {
    label: 'Ausstehend',
    order: 4,
    color: 'slate',
    price: 0,
    badgeColor: 'bg-slate-100 text-slate-600',
    marker: { size: 6, color: '#94a3b8', ring: false },
  },
} as const

export type AboStatus = keyof typeof ABO_STUFEN

export const VALID_ABO_STATUSES: AboStatus[] = [
  'standard',
  'starter',
  'partner',
  'premium',
  'pending',
]

export const PAID_ABO_STATUSES: AboStatus[] = ['starter', 'partner', 'premium']

export function getAboLabel(status: string): string {
  return ABO_STUFEN[status as AboStatus]?.label ?? status
}

export function getAboOrder(status: string): number {
  return ABO_STUFEN[status as AboStatus]?.order ?? 0
}

export function isPaidAbo(status: string): boolean {
  return PAID_ABO_STATUSES.includes(status as AboStatus)
}
