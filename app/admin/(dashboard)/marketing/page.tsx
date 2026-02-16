import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminMarketingPage() {
  const session = await getSession()
  const role = (session?.user as { role?: string })?.role
  const userId = (session?.user as { id?: string })?.id

  let makler = null
  if (role === 'makler' && userId) {
    makler = await prisma.makler.findUnique({
      where: { id: userId },
    })
  }

  const isPremium = makler?.status === 'premium' || makler?.status === 'gold'

  if (!isPremium && role === 'makler') {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-8">
        <h2 className="text-lg font-semibold text-amber-900">Marketing-Paket</h2>
        <p className="mt-2 text-amber-800">
          Das Marketing-Paket ist nur für Premium- und Gold-Makler verfügbar.
          Bitte wenden Sie sich an den Administrator, um Ihren Status zu aktualisieren.
        </p>
      </div>
    )
  }

  const tier = makler?.status === 'gold' ? 'gold' : 'premium'

  const premiumFiles = [
    { name: 'Siegel Premium-Makler (SVG)', path: '/marketing/premium/siegel.svg', desc: 'Für Website und E-Mail-Signatur' },
  ]

  const goldFiles = [
    ...premiumFiles,
    { name: 'Siegel Gold-Makler (SVG)', path: '/marketing/gold/siegel.svg', desc: 'Gold-Badge für Website' },
  ]

  const files = tier === 'gold' ? goldFiles : premiumFiles

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Digitales Marketing-Paket</h1>
      <p className="mt-2 text-slate-600">
        Ihr Status: <span className="font-medium capitalize">{tier}</span>
      </p>

      <div className="mt-8 space-y-6">
        {files.map((file) => (
          <div
            key={file.path}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6"
          >
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{file.desc}</p>
            </div>
            <a
              href={file.path}
              download
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Download
            </a>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Fügen Sie weitere Dateien (PNG, PDF, etc.) in{' '}
        <code className="rounded bg-slate-100 px-1">public/marketing/{tier}/</code> hinzu.
      </p>
    </div>
  )
}
