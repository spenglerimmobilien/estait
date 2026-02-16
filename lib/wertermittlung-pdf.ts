import type { PropertyType } from '@/lib/calculator'

const PROPERTY_LABELS: Record<PropertyType, string> = {
  wohnung: 'Wohnung',
  einfamilienhaus: 'Einfamilienhaus',
  mehrfamilienhaus: 'Mehrfamilienhaus',
  grundstueck: 'Grundstück',
}

export async function downloadWertermittlungPdf(params: {
  min: number
  max: number
  propertyType: PropertyType
  flaeche: number
  address?: string
  plz?: string
  city?: string
  region?: string
}) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()

  const { min, max, propertyType, flaeche, address, plz, city, region } = params
  const propertyLabel = PROPERTY_LABELS[propertyType]
  const location = address || (plz && city ? `${plz} ${city}` : plz || city || region || '–')
  const date = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  let y = 20

  // Titel
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Immobilien-Wertermittlung', 20, y)
  y += 12

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Erstellt am ${date}`, 20, y)
  y += 18

  // Objektdaten
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Objektangaben', 20, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Objektart: ${propertyLabel}`, 20, y)
  y += 6
  doc.text(`Wohnfläche / Fläche: ${flaeche} m²`, 20, y)
  y += 6
  doc.text(`Standort: ${location}`, 20, y)
  y += 14

  // Bewertung
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Geschätzter Verkehrswert', 20, y)
  y += 10

  doc.setFontSize(14)
  doc.setTextColor(0, 128, 128)
  doc.text(
    `ca. ${min.toLocaleString('de-DE')} € – ${max.toLocaleString('de-DE')} €`,
    20,
    y
  )
  doc.setTextColor(0, 0, 0)
  y += 18

  // Hinweis
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(
    'Dies ist eine grobe Schätzung auf Basis von Marktdaten und ersetzt keine professionelle Wertermittlung durch einen Sachverständigen.',
    20,
    y,
    { maxWidth: 170 }
  )
  doc.setTextColor(0, 0, 0)
  y += 20

  // Fußzeile
  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text('Erstellt mit dem Immobilienwert-Rechner', 20, 280)
  doc.text('Die Weitergabe an qualifizierte Makler erfolgt mit Ihrer Einwilligung.', 20, 285)

  doc.save(`Wertermittlung_${date.replace(/\./g, '-')}.pdf`)
}
