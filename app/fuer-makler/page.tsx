import Link from 'next/link'

const PLANS = [
  {
    id: 'kostenlos',
    name: 'Kostenlos',
    tagline: 'Einstieg ins Verzeichnis.',
    price: '0',
    priceUnit: '/Monat',
    features: [
      { text: 'Eintrag im Makler-Verzeichnis', check: true },
      { text: 'Sichtbar bei PLZ- und Stadt-Suche', check: true },
      { text: 'Name, Ort und Kontaktdaten', check: true },
      { text: 'Profilseite mit Basis-Infos', check: false },
      { text: 'Keine Hervorhebung in den Suchergebnissen', check: false },
      { text: 'Keine Inklusiv-Leads', check: false },
    ],
    cta: 'Kostenlos registrieren',
    ctaStyle: 'outline',
    highlighted: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Für Branding & Image.',
    price: '39',
    priceUnit: '/Monat',
    features: [
      { text: 'Nutzungsrecht ESTAIT-Siegel (Digital)', check: true },
      { text: 'Eintrag in die Partner-Map', check: true },
      { text: 'Logo hochladen & Profil vervollständigen', check: true },
      { text: 'Social Media Templates (Clean Look)', check: true },
      { text: 'Premium-Badge in den Suchergebnissen', check: true },
      { text: 'Keine Inklusiv-Leads', check: false },
    ],
    cta: 'Jetzt bewerben',
    ctaStyle: 'outline',
    highlighted: false,
  },
  {
    id: 'partner',
    name: 'Partner',
    tagline: 'Unser Bestseller für Wachstum.',
    price: '99',
    priceUnit: '/Monat',
    features: [
      { text: 'Nutzungsrecht ESTAIT-Siegel (Digital)', check: true },
      { text: 'Eintrag in die Partner-Map', check: true },
      { text: 'Logo hochladen & Profil vervollständigen', check: true },
      { text: 'Social Media Templates (Clean Look)', check: true },
      { text: 'Premium-Badge in den Suchergebnissen', check: true },
      { text: 'Physisches Branding-Kit (Acryl-Plakette)', check: true },
      { text: 'Exklusiver Gebietsschutz (PLZ)', check: true },
      { text: 'Priorität bei Lead-Zuweisung', check: true },
    ],
    cta: 'Jetzt bewerben',
    ctaStyle: 'primary',
    highlighted: true,
    badge: 'EMPFOHLEN',
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Full-Service Dominanz.',
    price: '199',
    priceUnit: '/Monat',
    features: [
      { text: 'Nutzungsrecht ESTAIT-Siegel (Digital)', check: true },
      { text: 'Eintrag in die Partner-Map', check: true },
      { text: 'Logo hochladen & Profil vervollständigen', check: true },
      { text: 'Social Media Templates (Clean Look)', check: true },
      { text: 'Premium-Badge in den Suchergebnissen', check: true },
      { text: 'Premium Branding Kit (Schaufenster Auslage, Print Material, Werbeartikel)', check: true },
      { text: 'Exklusiver Gebietsschutz (PLZ)', check: true },
      { text: 'Priorität bei Lead-Zuweisung', check: true },
      { text: 'Gold-Badge & Premium-Platzierung auf der Map', check: true },
      { text: 'Premium Branding-Kit (Schaufenster Auslage, Print Material, Werbeartikel)', check: true },
      { text: 'Qualifizierte Leads, auch in Nachbarstädten', check: true },
      { text: 'Vergünstigte Preise für Leads', check: true },
      { text: 'Exklusive Positionierung in Ihrer Region', check: true },
    ],
    cta: 'Jetzt bewerben',
    ctaStyle: 'outline',
    highlighted: false,
  },
]

export default function FuerMaklerPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Für Immobilienmakler
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Werden Sie Teil unseres qualifizierten Makler-Verzeichnisses und erreichen Sie
            Eigentümer, die Ihre Expertise suchen.
          </p>
        </div>

        <div className="mt-16 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col overflow-hidden rounded-xl border-2 ${
                  plan.highlighted
                    ? 'border-teal-400 bg-teal-50/50 shadow-md'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {plan.badge ? (
                  <div className="bg-teal-600 px-4 py-2.5 text-center text-sm font-semibold text-white">
                    {plan.badge}
                  </div>
                ) : (
                  <div className="h-[42px]" aria-hidden />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{plan.tagline}</p>
                  <div className="mt-6 min-h-[3.5rem]">
                    <span className={`text-3xl font-bold ${plan.highlighted ? 'text-teal-600' : 'text-slate-900'}`}>
                      {plan.price === '0' ? 'Kostenlos' : `€${plan.price}`}
                    </span>
                    {plan.price !== '0' && (
                      <span className="text-slate-600">{plan.priceUnit}</span>
                    )}
                  </div>
                  <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => {
                    const f = typeof feature === 'string' ? { text: feature, check: true } : feature
                    return (
                      <li key={f.text} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className={`mt-0.5 shrink-0 ${f.check ? 'text-teal-600' : 'text-slate-400'}`}>
                          {f.check ? '✓' : '✕'}
                        </span>
                        <span>{f.text}</span>
                      </li>
                    )
                  })}
                </ul>
                <Link
                  href={`/makler-registrieren?plan=${plan.id === 'kostenlos' ? 'standard' : plan.id}`}
                  className={`mt-8 block rounded-lg px-4 py-3 text-center text-sm font-semibold transition ${
                    plan.ctaStyle === 'primary'
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
          </div>
        </div>

        <div className="mt-20 rounded-xl border border-slate-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-slate-900">So funktioniert es</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-600">
                1
              </span>
              <div>
                <p className="font-medium text-slate-900">Eintrag anlegen</p>
                <p className="mt-1 text-sm text-slate-600">
                  Registrieren Sie sich kostenlos – Ihr Eintrag erscheint im Verzeichnis.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-600">
                2
              </span>
              <div>
                <p className="font-medium text-slate-900">Profil ausbauen</p>
                <p className="mt-1 text-sm text-slate-600">
                  Wählen Sie Starter, Partner oder Premium – mit mehr Sichtbarkeit und Leads.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-600">
                3
              </span>
              <div>
                <p className="font-medium text-slate-900">Leads erhalten</p>
                <p className="mt-1 text-sm text-slate-600">
                  Ab Partner: Qualifizierte Anfragen von Eigentümern in Ihrer Region.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
