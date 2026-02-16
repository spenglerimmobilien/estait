import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-slate-800">404</h1>
      <p className="mt-2 text-lg text-slate-600">Diese Seite wurde nicht gefunden.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-xl bg-teal-600 px-6 py-3 font-medium text-white transition hover:bg-teal-700"
        >
          Zur Startseite
        </Link>
        <Link
          href="/rechner"
          className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Immobilienwert berechnen
        </Link>
        <Link
          href="/makler"
          className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Makler finden
        </Link>
      </div>
    </div>
  )
}
