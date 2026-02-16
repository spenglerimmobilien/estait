'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export function HeaderNav() {
  const { data: session, status } = useSession()

  const iconClass =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white transition hover:bg-teal-700'

  const loginButtonClass =
    'rounded-md bg-teal-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-teal-700'

  if (status === 'loading') {
    return (
      <Link href="/anmelden" className={loginButtonClass}>
        Login
      </Link>
    )
  }

  if (session) {
    const initials = getInitials(session.user?.name ?? session.user?.email ?? undefined)
    return (
      <Link
        href="/admin"
        className={iconClass}
        title="Dashboard"
        aria-label="Zum Dashboard"
      >
        {initials}
      </Link>
    )
  }

  return (
    <Link href="/anmelden" className={loginButtonClass}>
      Login
    </Link>
  )
}
