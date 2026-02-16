import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const MAX_ASSIGNMENTS = 3

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  const role = (session?.user as { role?: string })?.role

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Nur Admins können Leads zuweisen.' }, { status: 403 })
  }

  const { id: leadId } = await params
  if (!leadId) {
    return NextResponse.json({ error: 'Lead-ID fehlt.' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { maklerId, action } = body

    if (action === 'add' && maklerId) {
      const count = await prisma.leadAssignment.count({ where: { leadId } })
      if (count >= MAX_ASSIGNMENTS) {
        return NextResponse.json(
          { error: `Maximal ${MAX_ASSIGNMENTS} Makler können einem Lead zugewiesen werden.` },
          { status: 400 }
        )
      }
      const makler = await prisma.makler.findUnique({ where: { id: String(maklerId) } })
      if (!makler) {
        return NextResponse.json({ error: 'Makler nicht gefunden.' }, { status: 404 })
      }
      await prisma.leadAssignment.upsert({
        where: {
          leadId_maklerId: { leadId, maklerId: String(maklerId) },
        },
        create: { leadId, maklerId: String(maklerId) },
        update: {},
      })
    } else if (action === 'remove' && maklerId) {
      await prisma.leadAssignment.deleteMany({
        where: { leadId, maklerId: String(maklerId) },
      })
    } else {
      return NextResponse.json({ error: 'Ungültige Aktion.' }, { status: 400 })
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { assignments: { include: { makler: true } } },
    })
    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('Lead assign error:', error)
    return NextResponse.json(
      { error: 'Zuweisung fehlgeschlagen.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  const role = (session?.user as { role?: string })?.role

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Nur Admins können Leads löschen.' }, { status: 403 })
  }

  const { id: leadId } = await params
  if (!leadId) {
    return NextResponse.json({ error: 'Lead-ID fehlt.' }, { status: 400 })
  }

  try {
    await prisma.lead.delete({ where: { id: leadId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead delete error:', error)
    return NextResponse.json(
      { error: 'Lead konnte nicht gelöscht werden.' },
      { status: 500 }
    )
  }
}
