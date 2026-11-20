export function Divider({ label, orientation = 'horizontal' }: { label?: string; orientation?: 'horizontal' | 'vertical' }) {
  if (orientation === 'vertical') return <span data-slot="divider" data-orientation="vertical" aria-hidden="true" />
  if (label) return <div data-slot="divider" data-orientation="horizontal" data-with-label="true"><span>{label}</span></div>
  return <hr data-slot="divider" data-orientation="horizontal" />
}
