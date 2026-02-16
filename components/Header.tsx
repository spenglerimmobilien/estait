'use client'

import Link from 'next/link'
import { HeaderNav } from './HeaderNav'

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className="text-xl font-bold text-slate-900">
            ESTAIT
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/rechner"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-600 hover:underline"
            >
              Immobilienwert
            </Link>
            <Link
              href="/makler"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-600 hover:underline"
            >
              Makler finden
            </Link>
            <Link
              href="/fuer-makler"
              className="text-sm font-medium text-slate-600 transition hover:text-teal-600 hover:underline"
            >
              Für Makler
            </Link>
          </nav>
        </div>
        <HeaderNav />
      </div>
    </header>
  )
}
