import Link from 'next/link'

const links = {
  Eigentümer: [
    { href: '/rechner', label: 'Wert berechnen' },
    { href: '/makler', label: 'Makler finden' },
  ],
  Rechtliches: [
    { href: '/impressum', label: 'Impressum' },
    { href: '/agb', label: 'AGB' },
    { href: '/datenschutz', label: 'Datenschutz' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-xl font-bold text-white">ESTAIT</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed">
              Ihr Verzeichnis für qualifizierte Immobilienmakler in Deutschland.
              Kostenlos den Wert berechnen und den passenden Makler finden.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Eigentümer
            </h4>
            <ul className="mt-4 space-y-3">
              {links.Eigentümer.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition hover:text-teal-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Rechtliches
            </h4>
            <ul className="mt-4 space-y-3">
              {links.Rechtliches.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition hover:text-teal-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-700 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500" suppressHydrationWarning>
            © {new Date().getFullYear()} ESTAIT. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6">
            {links.Rechtliches.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-slate-500 transition hover:text-slate-400"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
