'use client'

function ensureHttps(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
}

const SOCIAL_ICONS: Record<string, { label: string; svg: React.ReactNode }> = {
  facebook: {
    label: 'Facebook',
    svg: (
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    ),
  },
  instagram: {
    label: 'Instagram',
    svg: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    ),
  },
  linkedin: {
    label: 'LinkedIn',
    svg: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
  twitter: {
    label: 'X (Twitter)',
    svg: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
  },
  youtube: {
    label: 'YouTube',
    svg: (
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    ),
  },
  google: {
    label: 'Google Bewertungen',
    svg: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  },
}

interface MaklerSocialLinksProps {
  facebookUrl?: string | null
  instagramUrl?: string | null
  linkedinUrl?: string | null
  twitterUrl?: string | null
  youtubeUrl?: string | null
  googleBusinessUrl?: string | null
  firmenname: string
  city: string
}

export function MaklerSocialLinks({
  facebookUrl,
  instagramUrl,
  linkedinUrl,
  twitterUrl,
  youtubeUrl,
  googleBusinessUrl,
  firmenname,
  city,
}: MaklerSocialLinksProps) {
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${firmenname} ${city} Immobilienmakler Bewertungen`
  )}`

  const links: { key: string; url: string }[] = []
  if (facebookUrl?.trim()) links.push({ key: 'facebook', url: ensureHttps(facebookUrl) })
  if (instagramUrl?.trim()) links.push({ key: 'instagram', url: ensureHttps(instagramUrl) })
  if (linkedinUrl?.trim()) links.push({ key: 'linkedin', url: ensureHttps(linkedinUrl) })
  if (twitterUrl?.trim()) links.push({ key: 'twitter', url: ensureHttps(twitterUrl) })
  if (youtubeUrl?.trim()) links.push({ key: 'youtube', url: ensureHttps(youtubeUrl) })
  if (googleBusinessUrl?.trim()) links.push({ key: 'google', url: ensureHttps(googleBusinessUrl) })

  if (links.length === 0 && !googleSearchUrl) return null

  return (
    <div className="space-y-4">
      {links.length > 0 && (
        <div>
          <span className="text-sm font-medium text-slate-500">Social Media</span>
          <div className="mt-2 flex flex-wrap gap-3">
            {links.map(({ key, url }) => {
              const config = SOCIAL_ICONS[key]
              if (!config) return null
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-teal-100 hover:text-teal-700"
                  title={config.label}
                  aria-label={config.label}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    {config.svg}
                  </svg>
                </a>
              )
            })}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        {googleBusinessUrl?.trim() && (
          <a
            href={ensureHttps(googleBusinessUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.58.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Bewertungen bei Google ansehen
          </a>
        )}
        <a
          href={googleSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          Bei Google suchen
        </a>
      </div>
    </div>
  )
}
