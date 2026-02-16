import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function getSession() {
  return getServerSession(authOptions)
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session || (session.user as { role?: string }).role !== 'admin') {
    return null
  }
  return session
}

export async function requireMakler() {
  const session = await getSession()
  const role = (session?.user as { role?: string })?.role
  if (!session || (role !== 'makler' && role !== 'admin')) {
    return null
  }
  return session
}
