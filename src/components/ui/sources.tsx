import * as React from 'react'

export type Source = { title: string; href?: string; /** Shown under the title. Default: the host of `href`. */ note?: string }

function host(href?: string) {
  if (!href) return undefined
  try { return new URL(href).host.replace(/^www\./, '') } catch { return undefined }
}

export type CitationProps = Omit<React.ComponentProps<'a'>, 'children' | 'href'> & {
  /** The source number, as in the Sources list. */
  n: number
  /** Title of the source. It names the link for screen readers and shows on hover. */
  title?: string
  /** Opens in a new tab. Without it the chip is plain text. */
  href?: string
}

/** A numbered chip inside a sentence that points at one source: "…in stock [1]". */
export function Citation({ n, title, href, ...props }: CitationProps) {
  const label = title ? `Source ${n}: ${title}` : `Source ${n}`
  return href ? (
    <a data-slot="citation" href={href} target="_blank" rel="noreferrer" aria-label={label} title={title} {...props}>{n}</a>
  ) : (
    <span data-slot="citation" role="img" aria-label={label} title={title}>{n}</span>
  )
}

export type SourcesProps = Omit<React.ComponentProps<'section'>, 'children'> & {
  items: Source[]
  /** Heading above the list, and its accessible name. */
  label?: string
}

/** The sources an answer was built from, numbered to match its Citation chips. */
export function Sources({ items, label = 'Sources', ...props }: SourcesProps) {
  const id = React.useId()
  return (
    <section data-slot="sources" aria-labelledby={`${id}-label`} {...props}>
      <div data-slot="sources-label" id={`${id}-label`}>{label}</div>
      <ol data-slot="sources-list">
        {items.map((s, i) => (
          <li key={i} data-slot="source" value={i + 1}>
            <span data-slot="source-number" className="fp-num" aria-hidden="true">{i + 1}</span>
            <span data-slot="source-text">
              {s.href ? <a href={s.href} target="_blank" rel="noreferrer">{s.title}</a> : <span>{s.title}</span>}
              {(s.note ?? host(s.href)) && <span data-slot="source-note">{s.note ?? host(s.href)}</span>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
