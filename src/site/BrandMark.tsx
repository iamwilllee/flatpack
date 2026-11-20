/**
 * Flatpack UI mark: a square ink block with the F cut out of it.
 * No outline, no edge, no radius. Colors follow the theme.
 */
export function BrandMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false" style={{ display: 'block' }}>
      <rect width="32" height="32" style={{ fill: 'var(--fp-ink)' }} />
      <g style={{ fill: 'var(--fp-bg)' }}>
        <rect x="10" y="8" width="3.5" height="16" />
        <rect x="10" y="8" width="13" height="3.5" />
        <rect x="10" y="14.25" width="9" height="3.5" />
      </g>
    </svg>
  )
}

/** Full lockup: mark + wordmark, for docs headers and social cards. */
export function BrandLockup({ size = 24 }: { size?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--fp-space-2)' }}>
      <BrandMark size={size} />
      <span style={{ fontWeight: 'var(--fp-weight-semibold)', fontSize: 'var(--fp-text-base)' }}>Flatpack</span>
    </span>
  )
}
