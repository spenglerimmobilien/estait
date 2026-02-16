'use client'

export function HeaderPlaceholder() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="text-xl font-bold text-slate-900">
          ESTAIT
        </a>
        <nav className="flex items-center gap-4 sm:gap-6">
          <a
            href="/rechner"
            className="text-sm font-medium text-slate-600 transition hover:text-accent"
          >
            Immobilienwert
          </a>
          <a
            href="/makler"
            className="text-sm font-medium text-slate-600 transition hover:text-accent"
          >
            Makler finden
          </a>
          <a
            href="/fuer-makler"
            className="text-sm font-medium text-slate-600 transition hover:text-accent"
          >
            Für Makler
          </a>
          <a
            href="/anmelden"
            className="rounded-md bg-teal-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            Anmelden
          </a>
        </nav>
      </div>
    </header>
  )
}
