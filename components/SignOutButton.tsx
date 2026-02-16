'use client'

import { signOut } from 'next-auth/react'

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="text-sm text-slate-600 hover:text-slate-900"
    >
      Abmelden
    </button>
  )
}
