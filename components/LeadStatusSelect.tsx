'use client'

import { useState } from 'react'

const STATUS_OPTIONS = [
  { value: '', label: '– Status wählen –' },
  { value: 'offen', label: 'Offen' },
  { value: 'kontaktiert', label: 'Kontaktiert' },
  { value: 'absage', label: 'Absage' },
  { value: 'zusage', label: 'Zusage' },
]

interface LeadStatusSelectProps {
  assignmentId: string
  currentStatus: string | null
}

export function LeadStatusSelect({ assignmentId, currentStatus }: LeadStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus ?? '')
  const [updating, setUpdating] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value || null
    setStatus(newStatus ?? '')
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/leads/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maklerStatus: newStatus }),
      })
      if (!res.ok) {
        setStatus(currentStatus ?? '')
        const data = await res.json()
        alert(data.error || 'Status konnte nicht gespeichert werden.')
      }
    } catch {
      setStatus(currentStatus ?? '')
      alert('Status konnte nicht gespeichert werden.')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={updating}
      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 focus:border-teal-500 focus:ring-teal-500 disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value || '_'} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
