import * as React from 'react'

export function Empty({ title = '这里还空着', description, action, icon }: {
  title?: string
  description?: string
  action?: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div data-slot="empty">
      <div data-slot="empty-graphic">{icon ?? <DefaultGraphic />}</div>
      <div data-slot="empty-title">{title}</div>
      {description && <div data-slot="empty-description">{description}</div>}
      {action && <div data-slot="empty-action">{action}</div>}
    </div>
  )
}

function DefaultGraphic() {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" fill="none" aria-hidden="true">
      <rect x="1" y="9" width="70" height="46" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 21h70" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="15" r="1.6" fill="currentColor" />
      <circle cx="15" cy="15" r="1.6" fill="currentColor" />
      <path d="M23 39l9-11 7 8 6-6 5 9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 48h44" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
    </svg>
  )
}
