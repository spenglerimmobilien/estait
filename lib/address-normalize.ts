/**
 * Ersetzt gängige deutsche Straßenabkürzungen durch die ausgeschriebene Form.
 * Wird z.B. "Str." zu "Straße", "Pl." zu "Platz".
 */
const ABBREVIATIONS: [RegExp, string][] = [
  [/\bStr\./gi, 'Straße'],
  [/\bStrasse\b/gi, 'Straße'],
  [/\bPl\./gi, 'Platz'],
  [/\bCh\./gi, 'Chaussee'],
  [/\bProm\./gi, 'Promenade'],
  [/\bBlvd\./gi, 'Boulevard'],
]

export function expandStreetAbbreviations(text: string): string {
  if (!text || typeof text !== 'string') return text
  let result = text.trim()
  for (const [pattern, replacement] of ABBREVIATIONS) {
    result = result.replace(pattern, replacement)
  }
  return result
}
