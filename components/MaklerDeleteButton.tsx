'use client'

import { useState } from 'react'

interface MaklerDeleteButtonProps {
  maklerId: string
  maklerName?: string
}

export function MaklerDeleteButton({ maklerId, maklerName }: MaklerDeleteButtonProps) {
  const [deleting, setDeleting] = useState(false)
  const [confirm, setConfirm] = useState(false)

  async function handleDelete() {
    if (!confirm) {
      setConfirm(true)
      return
    }
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/makler/${maklerId}`, { method: 'DELETE' })
      if (res.ok) {
        window.location.reload()
      } else {
        const data = await res.json()
        alert(data.error || 'Löschen fehlgeschlagen.')
        setDeleting(false)
      }
    } catch {
      alert('Löschen fehlgeschlagen.')
      setDeleting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:opacity-50 ${
        confirm
          ? 'border border-red-500 bg-red-50 text-red-700 hover:bg-red-100'
          : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
      }`}
    >
      {deleting ? 'Wird gelöscht...' : confirm ? 'Wirklich löschen?' : 'Löschen'}
    </button>
  )
}
