import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { PasswortAendernForm } from '@/components/PasswortAendernForm'

export default async function EinstellungenPage() {
  const session = await getSession()
  const role = (session?.user as { role?: string })?.role
  const userId = (session?.user as { id?: string })?.id

  if (role !== 'makler' || !userId) {
    redirect('/admin')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Einstellungen</h1>
      <p className="mt-2 text-slate-600">
        Konto- und Sicherheitseinstellungen
      </p>

      <div className="mt-8 space-y-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Passwort ändern</h2>
          <p className="mt-1 text-sm text-slate-600">
            Ändern Sie Ihr Passwort für den Zugang zum Makler-Dashboard.
          </p>
          <PasswortAendernForm />
        </div>
      </div>
    </div>
  )
}
