import * as React from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Pagination } from '@/components/ui/pagination'
import { Empty } from '@/components/ui/empty'

export type SortValue = string | number | Date | boolean | null | undefined
export type SortState = { key: string; direction: 'asc' | 'desc' } | null

export type DataTableColumn<T> = {
  /** Unique per table. Also the property read when there is no `value`. */
  key: string
  header: React.ReactNode
  /** What the cell shows. Default: the value as text. */
  cell?: (row: T) => React.ReactNode
  /** What sorting compares. Default: `row[key]`. */
  value?: (row: T) => SortValue
  sortable?: boolean
  /** `end` for numbers and money, so digits line up. */
  align?: 'start' | 'end'
  width?: number | string
}

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  data: T[]
  /** A stable id per row. Selection is kept by id, so it survives sorting and paging. */
  getRowId: (row: T) => string

  sort?: SortState
  defaultSort?: SortState
  onSortChange?: (sort: SortState) => void

  /** Adds a checkbox column. */
  selectable?: boolean
  selected?: string[]
  defaultSelected?: string[]
  onSelectedChange?: (ids: string[]) => void

  /** Rows per page. Leave unset to show every row with no pagination. */
  pageSize?: number
  page?: number
  defaultPage?: number
  onPageChange?: (page: number) => void

  /** Shown in place of the rows when `data` is empty. */
  empty?: React.ReactNode
  /** A visible caption, which also names the table. Otherwise pass `aria-label`. */
  caption?: React.ReactNode
  'aria-label'?: string
  className?: string

  /** Accessible names, for localized products. */
  selectAllLabel?: string
  selectRowLabel?: (row: T) => string
  paginationLabel?: string
}

function useControllable<V>(value: V | undefined, initial: V, onChange?: (v: V) => void): [V, (v: V) => void] {
  const [inner, setInner] = React.useState(initial)
  const controlled = value !== undefined
  return [controlled ? value : inner, (v: V) => { if (!controlled) setInner(v); onChange?.(v) }]
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
function compare(a: SortValue, b: SortValue) {
  // Empty values always go last, whatever the direction.
  const ea = a == null || a === '', eb = b == null || b === ''
  if (ea || eb) return ea === eb ? 0 : ea ? 1 : -1
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b)
  return collator.compare(String(a), String(b))
}

/**
 * A Table with sorting, row selection and pagination for one array of rows. Click a sortable
 * header to sort ascending, again for descending, a third time to clear. Every piece of state
 * is controlled or uncontrolled on its own. Data is sorted and paged here, in the browser; for
 * server-side paging, pass one page of `data` and control `sort` and `page` yourself.
 */
export function DataTable<T>({
  columns, data, getRowId,
  sort: sortProp, defaultSort = null, onSortChange,
  selectable = false, selected: selectedProp, defaultSelected = [], onSelectedChange,
  pageSize, page: pageProp, defaultPage = 1, onPageChange,
  empty, caption, className,
  selectAllLabel = 'Select all rows', selectRowLabel, paginationLabel = 'Pages',
  ...aria
}: DataTableProps<T>) {
  const [sort, setSort] = useControllable(sortProp, defaultSort, onSortChange)
  const [selected, setSelected] = useControllable(selectedProp, defaultSelected, onSelectedChange)
  const [page, setPage] = useControllable(pageProp, defaultPage, onPageChange)

  const sorted = React.useMemo(() => {
    const col = sort && columns.find((c) => c.key === sort.key)
    if (!col || !sort) return data
    const read = col.value ?? ((r: T) => (r as Record<string, unknown>)[col.key] as SortValue)
    const sign = sort.direction === 'asc' ? 1 : -1
    // Index tie-break keeps equal rows in their original order.
    return data.map((r, i) => [r, i] as const).sort(([a, ia], [b, ib]) => {
      const va = read(a), vb = read(b)
      const blank = va == null || va === '' || vb == null || vb === ''
      return (blank ? compare(va, vb) : compare(va, vb) * sign) || ia - ib
    }).map(([r]) => r)
  }, [data, columns, sort])

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1
  const current = Math.min(Math.max(1, page), pageCount)
  const rows = pageSize ? sorted.slice((current - 1) * pageSize, current * pageSize) : sorted

  const ids = rows.map(getRowId)
  const chosen = new Set(selected)
  const onPage = ids.filter((id) => chosen.has(id)).length
  const toggleAll = (on: boolean) => {
    const next = new Set(selected)
    for (const id of ids) on ? next.add(id) : next.delete(id)
    setSelected([...next])
  }
  const toggle = (id: string, on: boolean) => setSelected(on ? [...selected, id] : selected.filter((x) => x !== id))

  const cycle = (key: string) => {
    if (!sort || sort.key !== key) setSort({ key, direction: 'asc' })
    else if (sort.direction === 'asc') setSort({ key, direction: 'desc' })
    else setSort(null)
  }
  const span = columns.length + (selectable ? 1 : 0)

  return (
    <div data-slot="data-table" className={className}>
      <Table {...aria}>
        {caption != null && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead data-select="true">
                <Checkbox
                  aria-label={selectAllLabel}
                  checked={ids.length > 0 && onPage === ids.length}
                  indeterminate={onPage > 0 && onPage < ids.length}
                  disabled={ids.length === 0}
                  onCheckedChange={(on) => toggleAll(on)}
                />
              </TableHead>
            )}
            {columns.map((c) => {
              const dir = sort?.key === c.key ? sort.direction : null
              return (
                <TableHead
                  key={c.key}
                  data-align={c.align ?? 'start'}
                  style={c.width != null ? { width: c.width } : undefined}
                  aria-sort={c.sortable ? (dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none') : undefined}
                >
                  {c.sortable ? (
                    <button type="button" data-slot="data-table-sort" data-active={dir ? 'true' : undefined} onClick={() => cycle(c.key)}>
                      {c.header}
                      <span data-slot="data-table-sort-icon" aria-hidden="true">
                        {dir === 'asc' ? <ArrowUp size={14} /> : dir === 'desc' ? <ArrowDown size={14} /> : <ArrowUpDown size={14} />}
                      </span>
                    </button>
                  ) : c.header}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow data-empty="true">
              <TableCell colSpan={span}>{empty ?? <Empty title="No results" />}</TableCell>
            </TableRow>
          ) : rows.map((r) => {
            const id = getRowId(r)
            const on = chosen.has(id)
            return (
              <TableRow key={id} data-selected={on ? 'true' : undefined}>
                {selectable && (
                  <TableCell data-select="true">
                    <Checkbox aria-label={selectRowLabel ? selectRowLabel(r) : `Select row ${id}`} checked={on} onCheckedChange={(v) => toggle(id, v)} />
                  </TableCell>
                )}
                {columns.map((c) => (
                  <TableCell key={c.key} data-align={c.align ?? 'start'}>
                    {c.cell ? c.cell(r) : String((r as Record<string, unknown>)[c.key] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {pageSize != null && sorted.length > pageSize && (
        <div data-slot="data-table-footer">
          <Pagination total={sorted.length} pageSize={pageSize} value={current} onValueChange={setPage} label={paginationLabel} />
        </div>
      )}
    </div>
  )
}
