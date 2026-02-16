import Link from 'next/link'
import { GoldMaklerCarousel } from '@/components/GoldMaklerCarousel'
import { HowItWorks } from '@/components/HowItWorks'
import { TrustSection } from '@/components/TrustSection'
import { FeaturesSection } from '@/components/FeaturesSection'

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900"
        style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #134e4a)' }}
      >
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Der richtige Makler
              <br />
              <span className="text-teal-400">für Ihre Immobilie</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Finden Sie qualifizierte Immobilienmakler in Ihrer Nähe. Berechnen Sie
              den Wert Ihrer Immobilie – schnell, unverbindlich und kostenlos.
            </p>
            <div
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '2.5rem' }}
            >
              <Link
                href="/rechner"
                className="inline-flex w-full items-center justify-center rounded-lg bg-teal-500 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-teal-600 sm:w-auto"
                style={{ padding: '1rem 2rem', borderRadius: '0.5rem', backgroundColor: '#14b8a6', color: 'white', textDecoration: 'none', fontWeight: 600 }}
              >
                Immobilienwert berechnen
              </Link>
              <Link
                href="/makler"
                className="inline-flex w-full items-center justify-center rounded-lg border-2 border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:w-auto"
                style={{ padding: '1rem 2rem', borderRadius: '0.5rem', border: '2px solid rgba(255,255,255,0.3)', color: 'white', textDecoration: 'none', fontWeight: 600 }}
              >
                Makler in meiner Nähe finden
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gold Makler Carousel */}
      <GoldMaklerCarousel />

      {/* So funktioniert's */}
      <HowItWorks />

      {/* Trust Section */}
      <TrustSection />

      {/* Features Section */}
      <FeaturesSection />
    </div>
  )
}
