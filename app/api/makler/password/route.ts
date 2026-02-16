import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { compare, hash } from 'bcryptjs'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string })?.role
  const userId = (session?.user as { id?: string })?.id

  if (role !== 'makler' || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { currentPassword, newPassword } = body

  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return NextResponse.json(
      { error: 'Das neue Passwort muss mindestens 8 Zeichen haben.' },
      { status: 400 }
    )
  }

  const makler = await prisma.makler.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  })

  if (!makler?.passwordHash) {
    return NextResponse.json(
      { error: 'Kein Passwort gesetzt. Bitte wenden Sie sich an den Support.' },
      { status: 400 }
    )
  }

  const valid = await compare(currentPassword, makler.passwordHash)
  if (!valid) {
    return NextResponse.json(
      { error: 'Das aktuelle Passwort ist falsch.' },
      { status: 400 }
    )
  }

  const passwordHash = await hash(newPassword, 10)
  await prisma.makler.update({
    where: { id: userId },
    data: { passwordHash },
  })

  return NextResponse.json({ success: true })
}
