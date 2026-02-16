import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Name, E-Mail und Passwort sind erforderlich.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Passwort muss mindestens 6 Zeichen haben.' },
        { status: 400 }
      )
    }

    const existing = await prisma.eigentuemer.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Diese E-Mail-Adresse ist bereits registriert.' },
        { status: 400 }
      )
    }

    const passwordHash = await hash(password, 10)

    await prisma.eigentuemer.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Registration error:', error)
    const message =
      error instanceof Error ? error.message : 'Registrierung fehlgeschlagen.'
    const isPrismaUnique =
      error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'P2002'
    return NextResponse.json(
      {
        error: isPrismaUnique
          ? 'Diese E-Mail-Adresse ist bereits registriert.'
          : process.env.NODE_ENV === 'development'
            ? message
            : 'Registrierung fehlgeschlagen.',
      },
      { status: 500 }
    )
  }
}
