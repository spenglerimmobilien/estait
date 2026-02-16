import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'E-Mail', type: 'email' },
        password: { label: 'Passwort', type: 'password' },
        role: { label: 'Rolle', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        if (credentials.role === 'admin') {
          const ok =
            credentials.email === process.env.ADMIN_EMAIL &&
            credentials.password === process.env.ADMIN_PASSWORD
          if (ok) {
            return { id: 'admin', name: 'Admin', email: credentials.email, role: 'admin' }
          }
          return null
        }

        if (credentials.role === 'eigentuemer') {
          const eigentuemer = await prisma.eigentuemer.findUnique({
            where: { email: credentials.email.trim().toLowerCase() },
          })
          if (!eigentuemer) return null
          const valid = await compare(credentials.password, eigentuemer.passwordHash)
          if (valid) {
            return { id: eigentuemer.id, name: eigentuemer.name, email: eigentuemer.email, role: 'eigentuemer' }
          }
          return null
        }

        const emailNorm = credentials.email.trim().toLowerCase()
        const makler = await prisma.makler.findFirst({
          where: { email: emailNorm },
        })
        if (!makler?.passwordHash) return null
        const valid = await compare(credentials.password, makler.passwordHash)
        if (valid) {
          const displayName = makler.firmenname || makler.name
          return { id: makler.id, name: displayName, email: makler.email ?? undefined, role: 'makler' }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string
        (session.user as { id?: string }).id = token.userId as string
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: { strategy: 'jwt' },
}
