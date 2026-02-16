import Link from 'next/link'

const features = [
  {
    title: 'Immobilienwert berechnen',
    description: 'Kostenlose Schätzung in wenigen Minuten – unverbindlich und ohne Registrierung. Ideal für Ihre erste Orientierung.',
    href: '/rechner',
    cta: 'Zum Rechner',
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'teal',
  },
  {
    title: 'Makler in Ihrer Nähe',
    description: 'Suchen Sie nach PLZ oder Stadt und vergleichen Sie qualifizierte Makler – mit Bewertungen und Spezialisierungen.',
    href: '/makler',
    cta: 'Makler finden',
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'teal',
  },
  {
    title: 'Qualitätsgeprüfte Partner',
    description: 'Gold- und Premium-Makler durchlaufen unsere Prüfung – für höchste Standards bei Ihrem Immobilienverkauf.',
    href: '/fuer-makler',
    cta: 'Mehr erfahren',
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    color: 'amber',
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Alles für Ihren Verkauf
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Von der ersten Wertschätzung bis zum richtigen Makler – wir begleiten Sie
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                  f.color === 'amber'
                    ? 'bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
                    : 'bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white'
                } transition-colors`}
              >
                {f.icon}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                {f.title}
              </h3>
              <p className="mt-2 flex-1 text-slate-600">
                {f.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-teal-600 group-hover:text-teal-700">
                {f.cta}
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
