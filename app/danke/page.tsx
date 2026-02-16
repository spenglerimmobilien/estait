import Link from 'next/link'

export default function DankePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="rounded-xl border border-slate-200 bg-white p-12 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-teal-600">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">Vielen Dank!</h1>
        <p className="mt-4 text-slate-600">
          Ihre Anfrage wurde erfolgreich übermittelt. Ein qualifizierter Makler wird sich in Kürze bei Ihnen melden.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition hover:bg-teal-700"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  )
}
