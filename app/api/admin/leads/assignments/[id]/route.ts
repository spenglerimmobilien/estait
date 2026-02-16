import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const VALID_STATUSES = ['offen', 'kontaktiert', 'absage', 'zusage'] as const

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession()
  const role = (session?.user as { role?: string })?.role
  const userId = (session?.user as { id?: string })?.id

  const assignmentId = params.id
  if (!assignmentId) {
    return NextResponse.json({ error: 'Assignment-ID fehlt.' }, { status: 400 })
  }

  const assignment = await prisma.leadAssignment.findUnique({
    where: { id: assignmentId },
    include: { makler: true },
  })
  if (!assignment) {
    return NextResponse.json({ error: 'Zuweisung nicht gefunden.' }, { status: 404 })
  }

  if (role === 'makler') {
    if (assignment.maklerId !== userId) {
      return NextResponse.json({ error: 'Keine Berechtigung.' }, { status: 403 })
    }
  } else if (role !== 'admin') {
    return NextResponse.json({ error: 'Keine Berechtigung.' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { maklerStatus } = body

    if (maklerStatus !== null && maklerStatus !== undefined) {
      const status = String(maklerStatus).toLowerCase()
      if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
        return NextResponse.json(
          { error: `Ungültiger Status. Erlaubt: ${VALID_STATUSES.join(', ')}` },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.leadAssignment.update({
      where: { id: assignmentId },
      data: { maklerStatus: maklerStatus || null },
      include: { makler: true, lead: true },
    })
    return NextResponse.json({ success: true, assignment: updated })
  } catch (error) {
    console.error('Assignment status update error:', error)
    return NextResponse.json(
      { error: 'Status konnte nicht aktualisiert werden.' },
      { status: 500 }
    )
  }
}
