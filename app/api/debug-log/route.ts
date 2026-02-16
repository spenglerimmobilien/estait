import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const LOG_PATH = path.join(process.cwd(), '.cursor', 'debug.log')
const FALLBACK_PATH = path.join(process.cwd(), 'debug-hydration.log')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const line = JSON.stringify(body) + '\n'
    try {
      fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true })
      fs.appendFileSync(LOG_PATH, line)
    } catch {
      fs.appendFileSync(FALLBACK_PATH, line)
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
