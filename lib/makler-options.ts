/** Tätigkeitsbereiche des Immobilienmaklers */
export const TAETIGKEITSBEREICHE = [
  { id: 'wohnimmobilien', label: 'Wohnimmobilien' },
  { id: 'gewerbeimmobilien', label: 'Gewerbeimmobilien' },
  { id: 'kapitalanlagen', label: 'Kapitalanlagen' },
  { id: 'grundstuecke', label: 'Grundstücke' },
  { id: 'denkmalimmobilien', label: 'Denkmalimmobilien' },
  { id: 'neubauimmobilien', label: 'Neubauimmobilien' },
] as const

/** Leistungen des Immobilienmaklers */
export const LEISTUNGEN = [
  { id: 'kostenlose-bewertung', label: 'Kostenlose Immobilienbewertung' },
  { id: 'energieausweis-erstellung', label: 'Energieausweis Erstellung' },
  { id: 'energieausweis-vermittlung', label: 'Energieausweisvermittlung' },
  { id: '360-besichtigung', label: '360° Besichtigung' },
  { id: 'professionelle-fotos', label: 'Professionelle Fotos' },
  { id: 'social-media-aufnahmen', label: 'Social Media Aufnahmen' },
  { id: 'drohnen-aufnahmen', label: 'Drohnen Aufnahmen' },
  { id: 'digitales-home', label: 'Digitales Home' },
  { id: 'staging', label: 'Staging' },
  { id: 'grundriss-erstellung', label: 'Grundriss Erstellung' },
  { id: 'exposé-erstellung', label: 'Exposé Erstellung' },
  { id: 'virtuelle-besichtigung', label: 'Virtuelle Besichtigung' },
  { id: 'maklercourtage', label: 'Maklercourtage / Provisionsberatung' },
] as const

export type TaetigkeitsbereichId = (typeof TAETIGKEITSBEREICHE)[number]['id']
export type LeistungId = (typeof LEISTUNGEN)[number]['id']
