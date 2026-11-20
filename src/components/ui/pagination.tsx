import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({ total, pageSize = 10, value, defaultValue = 1, onValueChange, siblingCount = 1 }: {
  total: number
  pageSize?: number
  value?: number
  defaultValue?: number
  onValueChange?: (page: number) => void
  siblingCount?: number
}) {
  const [internal, setInternal] = React.useState(defaultValue)
  const page = value !== undefined ? value : internal
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const go = (p: number) => {
    const next = Math.max(1, Math.min(pageCount, p))
    if (value === undefined) setInternal(next)
    onValueChange?.(next)
  }
  const pages = React.useMemo(() => {
    const set = new Set<number>([1, pageCount])
    for (let i = page - siblingCount; i <= page + siblingCount; i++) if (i >= 1 && i <= pageCount) set.add(i)
    const sorted = [...set].sort((a, b) => a - b)
    const out: (number | 'ellipsis')[] = []
    sorted.forEach((p, i) => {
      if (i > 0 && p - sorted[i - 1] > 1) out.push('ellipsis')
      out.push(p)
    })
    return out
  }, [page, pageCount, siblingCount])

  return (
    <nav data-slot="pagination" aria-label="分页">
      <button data-slot="pagination-btn" data-nav="true" type="button" disabled={page <= 1} onClick={() => go(page - 1)} aria-label="上一页">
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, i) => p === 'ellipsis'
        ? <span data-slot="pagination-ellipsis" key={`e${i}`}>···</span>
        : <button data-slot="pagination-btn" data-active={p === page} type="button" key={p} onClick={() => go(p)}>{p}</button>)}
      <button data-slot="pagination-btn" data-nav="true" type="button" disabled={page >= pageCount} onClick={() => go(page + 1)} aria-label="下一页">
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
