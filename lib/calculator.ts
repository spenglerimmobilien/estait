import plzPreise from '@/data/plz-preise.json'

export type PropertyType = 'wohnung' | 'einfamilienhaus' | 'mehrfamilienhaus' | 'grundstueck'
export type Condition = 'gut' | 'mittel' | 'renovierungsbeduerftig'

interface CalculatorInput {
  plz: string
  flaeche: number
  propertyType: PropertyType
  baujahr?: number
  condition: Condition
}

interface CalculatorResult {
  min: number
  max: number
  plzFound: boolean
  region?: string
  exactMatch?: boolean
}

const DEFAULT_PRICE_PER_SQM = 3500

function getPricePerSqm(plz: string): { price: number; region: string; exact: boolean } | null {
  const normalized = plz.replace(/\s/g, '').padStart(5, '0').slice(0, 5)
  const entry = plzPreise.find((p) => p.plz === normalized)
  if (entry) {
    return { price: entry.avgPricePerSqm, region: entry.region, exact: true }
  }
  const leitregion = normalized.slice(0, 2)
  const regionMatches = plzPreise.filter((p) => p.plz.startsWith(leitregion))
  if (regionMatches.length > 0) {
    const avgPrice = Math.round(
      regionMatches.reduce((sum, p) => sum + p.avgPricePerSqm, 0) / regionMatches.length
    )
    return {
      price: avgPrice,
      region: `${regionMatches[0].region.split(',')[0]} (Region)`,
      exact: false,
    }
  }
  return null
}

function getPropertyTypeFactor(type: PropertyType): number {
  switch (type) {
    case 'wohnung':
      return 1.0
    case 'einfamilienhaus':
      return 1.15
    case 'mehrfamilienhaus':
      return 0.95
    case 'grundstueck':
      return 0.15
    default:
      return 1.0
  }
}

function getConditionFactor(condition: Condition): number {
  switch (condition) {
    case 'gut':
      return 1.1
    case 'mittel':
      return 1.0
    case 'renovierungsbeduerftig':
      return 0.85
    default:
      return 1.0
  }
}

function getBaujahrFactor(baujahr?: number): number {
  if (!baujahr) return 1.0
  const currentYear = new Date().getFullYear()
  const age = currentYear - baujahr
  if (age < 5) return 1.1
  if (age < 15) return 1.05
  if (age < 30) return 1.0
  if (age < 50) return 0.95
  return 0.9
}

export function calculatePropertyValue(input: CalculatorInput): CalculatorResult {
  const { plz, flaeche, propertyType, baujahr, condition } = input

  const plzData = getPricePerSqm(plz)
  const basePrice = plzData?.price ?? DEFAULT_PRICE_PER_SQM

  const typeFactor = getPropertyTypeFactor(propertyType)
  const conditionFactor = getConditionFactor(condition)
  const baujahrFactor = getBaujahrFactor(propertyType === 'grundstueck' ? undefined : baujahr)

  const baujahrFactorForLand = propertyType === 'grundstueck' ? 1.0 : baujahrFactor
  const conditionFactorForLand = propertyType === 'grundstueck' ? 1.0 : conditionFactor
  const pricePerSqm = basePrice * typeFactor * conditionFactorForLand * baujahrFactorForLand
  const baseValue = flaeche * pricePerSqm

  const spread = 0.12
  const min = Math.round(baseValue * (1 - spread) / 1000) * 1000
  const max = Math.round(baseValue * (1 + spread) / 1000) * 1000

  return {
    min,
    max,
    plzFound: !!plzData,
    region: plzData?.region,
    exactMatch: plzData?.exact ?? false,
  }
}
