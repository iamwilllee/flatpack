import * as React from 'react'
import { Check, Copy } from 'lucide-react'

/** Inline code. */
export function Code({ children }: { children: React.ReactNode }) {
  return <code data-slot="code">{children}</code>
}

/** A code sample on a light surface, with a copy button. */
export function CodeBlock({ code, label = 'TSX', copyLabel = 'Copy' }: { code: string; label?: string; copyLabel?: string }) {
  const [copied, setCopied] = React.useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => {})
  }
  return (
    <div data-slot="code-block">
      <div data-slot="code-block-header">
        <span data-slot="code-block-label">{label}</span>
        <button data-slot="button" data-variant="ghost" data-size="icon" type="button" onClick={copy} title={copyLabel} aria-label={copyLabel} style={{ width: 'var(--fp-control-sm)', height: 'var(--fp-control-sm)', color: 'var(--fp-muted)' }}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <pre data-slot="code-block-pre">{code}</pre>
    </div>
  )
}
