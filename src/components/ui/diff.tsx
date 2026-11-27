import * as React from 'react'
import { FileCode } from 'lucide-react'
import { VisuallyHidden } from '@/components/ui/visually-hidden'

export type DiffLineKind = 'add' | 'del' | 'context' | 'hunk'
export type DiffLabels = { add: string; del: string }

export type DiffProps = Omit<React.ComponentProps<'figure'>, 'children'> & {
  /** The change in unified diff form: lines that start with "+" are added, "-" removed, a space unchanged. `@@` lines mark where a section starts. */
  patch: string
  /** File name shown above the lines. */
  file?: string
  /** Screen reader text for added and removed lines, for localized products. */
  labels?: DiffLabels
}

const DEFAULT_LABELS: DiffLabels = { add: 'Added: ', del: 'Removed: ' }

/**
 * Turn a unified diff into lines. The `--- a/file` and `+++ b/file` header lines are dropped, but
 * only when the patch also has an `@@` line; in a bare snippet they are ordinary changed lines.
 */
export function parsePatch(patch: string): { kind: DiffLineKind; text: string }[] {
  const lines = patch.replace(/\r?\n$/, '').split(/\r?\n/)
  const hasHunk = lines.some((l) => l.startsWith('@@'))
  const out: { kind: DiffLineKind; text: string }[] = []
  let seenHunk = false
  for (const l of lines) {
    if (l.startsWith('@@')) { seenHunk = true; out.push({ kind: 'hunk', text: l }); continue }
    if (hasHunk && !seenHunk && (l.startsWith('--- ') || l.startsWith('+++ ') || l.startsWith('diff ') || l.startsWith('index '))) continue
    if (l.startsWith('+')) out.push({ kind: 'add', text: l.slice(1) })
    else if (l.startsWith('-')) out.push({ kind: 'del', text: l.slice(1) })
    else out.push({ kind: 'context', text: l.startsWith(' ') ? l.slice(1) : l })
  }
  return out
}

/** Code the assistant changed, as the lines that went away and the lines that came in. */
export function Diff({ patch, file, labels = DEFAULT_LABELS, ...props }: DiffProps) {
  const lines = parsePatch(patch)
  return (
    <figure data-slot="diff" {...props}>
      {file && <figcaption data-slot="diff-file"><FileCode size={16} aria-hidden="true" />{file}</figcaption>}
      <pre data-slot="diff-body">
        {lines.map((l, i) => (
          <span key={i} data-slot="diff-line" data-kind={l.kind}>
            {l.kind === 'add' && <VisuallyHidden>{labels.add}</VisuallyHidden>}
            {l.kind === 'del' && <VisuallyHidden>{labels.del}</VisuallyHidden>}
            <span data-slot="diff-marker" aria-hidden="true">{l.kind === 'add' ? '+' : l.kind === 'del' ? '-' : ' '}</span>
            {l.text}
          </span>
        ))}
      </pre>
    </figure>
  )
}

export type DiffValueProps = Omit<React.ComponentProps<'span'>, 'children'> & {
  from: React.ReactNode
  to: React.ReactNode
  labels?: { from: string; to: string }
}

/** One value that changed, for a table cell: the old value struck out, then the new one. */
export function DiffValue({ from, to, labels = { from: 'Was: ', to: 'Now: ' }, ...props }: DiffValueProps) {
  return (
    <span data-slot="diff-value" {...props}>
      <del data-slot="diff-value-from"><VisuallyHidden>{labels.from}</VisuallyHidden>{from}</del>
      <ins data-slot="diff-value-to"><VisuallyHidden>{labels.to}</VisuallyHidden>{to}</ins>
    </span>
  )
}
