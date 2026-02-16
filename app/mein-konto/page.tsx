import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'

export default async function MeinKontoPage() {
  const session = await getSession()
  const role = (session?.user as { role?: string })?.role

  if (!session || role !== 'eigentuemer') {
    redirect('/anmelden?callbackUrl=/mein-konto')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">Mein Konto</h1>
      <p className="mt-2 text-slate-600">
        Willkommen, {session.user?.name}!
      </p>
      <div className="mt-10 rounded-xl border border-slate-200 bg-white p-8">
        <p className="text-slate-600">
          Hier können Sie Ihre Immobilienbewertungen und Makler-Anfragen verwalten.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            href="/rechner"
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Immobilienwert berechnen
          </Link>
          <Link
            href="/makler"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Makler finden
          </Link>
        </div>
      </div>
    </div>
  )
}
