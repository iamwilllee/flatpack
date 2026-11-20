import * as React from 'react'

export type DescriptionItem = { term: React.ReactNode; value: React.ReactNode }

/** Key / value pairs separated by hairlines. `stacked` puts the term above the value. */
export function DescriptionList({ items, layout = 'inline' }: { items: DescriptionItem[]; layout?: 'inline' | 'stacked' }) {
  return (
    <dl data-slot="description-list" data-layout={layout}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <dt>{it.term}</dt>
          <dd>{it.value}</dd>
        </React.Fragment>
      ))}
    </dl>
  )
}
