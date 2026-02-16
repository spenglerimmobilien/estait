import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { isPaidAbo } from '@/lib/abo-stufen'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import { SignOutButton } from '@/components/SignOutButton'
import { MaklerSidebar } from '@/components/MaklerSidebar'
import { AdminSidebar } from '@/components/AdminSidebar'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const role = (session?.user as { role?: string })?.role

  if (!session || (role !== 'admin' && role !== 'makler')) {
    redirect('/admin/login?callbackUrl=' + encodeURIComponent('/admin'))
  }

  const isAdmin = role === 'admin'
  const userId = (session?.user as { id?: string })?.id

  let maklerStatus: string | null = null
  if (role === 'makler' && userId) {
    const makler = await prisma.makler.findUnique({
      where: { id: userId },
      select: { status: true },
    })
    maklerStatus = makler?.status ?? null
  }

  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar signOut={<SignOutButton />} />
        <main className="flex-1 overflow-auto px-8 py-8">{children}</main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <MaklerSidebar
        userName={session?.user?.name || 'Makler'}
        showMarketing={maklerStatus ? isPaidAbo(maklerStatus) : false}
        signOut={<SignOutButton />}
      />
      <main className="flex-1 overflow-auto px-8 py-8">{children}</main>
    </div>
  )
}
