import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import './globals.css'
import { Footer } from '@/components/Footer'
import { AuthSessionProvider } from '@/components/SessionProvider'

const ClientHeader = dynamic(
  () => import('@/components/ClientHeader').then((m) => ({ default: m.ClientHeader }))
)

export const metadata: Metadata = {
  title: 'ESTAIT | Makler finden & Immobilienwert berechnen',
  description: 'Finden Sie qualifizierte Immobilienmakler in Ihrer Nähe. Berechnen Sie den Wert Ihrer Immobilie – schnell und unverbindlich.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className="font-sans antialiased">
        <AuthSessionProvider>
          <div className="flex min-h-screen flex-col">
            <ClientHeader />
            <main className="flex-1 overflow-x-hidden">{children}</main>
            <Footer />
          </div>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
