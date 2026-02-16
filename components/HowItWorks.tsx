import Link from 'next/link'

const steps = [
  {
    step: 1,
    title: 'Wert berechnen',
    description: 'Nutzen Sie unseren kostenlosen Rechner und erhalten Sie in wenigen Minuten eine erste Einschätzung Ihres Immobilienwerts.',
    href: '/rechner',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    step: 2,
    title: 'Makler vergleichen',
    description: 'Finden Sie qualifizierte Makler in Ihrer Region – mit Bewertungen, Spezialisierungen und transparenten Konditionen.',
    href: '/makler',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    step: 3,
    title: 'Verkauf starten',
    description: 'Wählen Sie Ihren Makler und starten Sie Ihren Verkauf – professionell begleitet von Anfang bis Ende.',
    href: '/makler',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

export function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            So funktioniert&apos;s
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            In drei einfachen Schritten zum erfolgreichen Immobilienverkauf
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:gap-12 lg:grid-cols-3">
          {steps.map((item, i) => (
            <Link
              key={item.step}
              href={item.href}
              className="group relative flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-8 transition-all duration-300 hover:border-teal-200 hover:bg-white hover:shadow-lg hover:shadow-teal-500/5"
            >
              <div className="absolute -top-4 left-8 flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white shadow-md">
                {item.step}
              </div>
              <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100 text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                {item.icon}
              </div>
              <h3 className="mt-6 text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-slate-600">
                {item.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-teal-600 group-hover:text-teal-700">
                Mehr erfahren
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              {i < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block">
                  <svg className="h-8 w-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
