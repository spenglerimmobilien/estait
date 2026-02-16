const trustItems = [
  {
    value: '100%',
    label: 'Kostenlos',
    sub: 'Wertberechnung & Maklersuche',
  },
  {
    value: 'Qualitätsgeprüft',
    label: 'Makler',
    sub: 'Transparente Bewertungen',
  },
  {
    value: 'Deutschlandweit',
    label: 'Abdeckung',
    sub: 'Für ganz Deutschland',
  },
]

export function TrustSection() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center text-center"
            >
              <p className="text-2xl font-bold text-teal-600 sm:text-3xl">
                {item.value}
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {item.label}
              </p>
              <p className="mt-0.5 text-sm text-slate-600">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
