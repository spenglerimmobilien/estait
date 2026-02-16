'use client'

type LogoShape = 'square' | 'rounded' | 'circle'
type LogoSize = 'sm' | 'md' | 'lg'

const SIZE_CLASSES: Record<LogoSize, string> = {
  sm: 'h-12 w-12 min-h-[3rem] min-w-[3rem]',
  md: 'h-20 w-20 min-h-[5rem] min-w-[5rem]',
  lg: 'h-28 w-28 min-h-[7rem] min-w-[7rem]',
}

const SHAPE_CLASSES: Record<LogoShape, string> = {
  square: 'rounded-lg',
  rounded: 'rounded-2xl',
  circle: 'rounded-full',
}

interface MaklerLogoProps {
  logoUrl: string | null
  alt: string
  shape?: LogoShape
  size?: LogoSize
  className?: string
  /** Für rechteckige Logos: object-contain zeigt das ganze Logo */
  objectFit?: 'contain' | 'cover'
}

export function MaklerLogo({
  logoUrl,
  alt,
  shape = 'rounded',
  size = 'md',
  className = '',
  objectFit,
}: MaklerLogoProps) {
  const sizeClass = SIZE_CLASSES[size]
  const shapeClass = SHAPE_CLASSES[shape]
  const fitClass = (objectFit ?? (shape === 'circle' ? 'cover' : 'contain')) === 'contain'
    ? 'object-contain'
    : 'object-cover'

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden border border-slate-200/80 bg-white shadow-sm ${sizeClass} ${shapeClass} ${className}`}
      style={{ aspectRatio: shape === 'circle' ? '1' : undefined }}
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={alt}
          className={`h-full w-full p-0.5 sm:p-1 ${fitClass}`}
        />
      ) : (
        <span
          className={`flex items-center justify-center font-semibold tracking-tight text-slate-400 ${
            size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl'
          }`}
        >
          {(alt || '')
            .split(/\s+/)
            .map((w) => w[0])
            .filter(Boolean)
            .slice(0, 2)
            .join('')
            .toUpperCase() || '—'}
        </span>
      )}
    </div>
  )
}
