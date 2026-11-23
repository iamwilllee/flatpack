import * as React from 'react'
import { Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChipGroup } from '@/components/ui/chip-group'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Empty } from '@/components/ui/empty'
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

export type Order = { id: string; customer: string; status: 'Paid' | 'Pending' | 'Refunded'; total: number; date: string }

const SAMPLE: Order[] = [
  { id: 'A-1042', customer: 'Lena Fischer', status: 'Paid', total: 1299, date: '2025-05-02' },
  { id: 'A-1041', customer: 'Tomás Ruiz', status: 'Pending', total: 499, date: '2025-05-02' },
  { id: 'A-1040', customer: 'Mei Chen', status: 'Paid', total: 2398, date: '2025-05-01' },
  { id: 'A-1039', customer: 'Noah Smith', status: 'Refunded', total: 199, date: '2025-04-30' },
  { id: 'A-1038', customer: 'Aiko Tanaka', status: 'Paid', total: 749, date: '2025-04-30' },
  { id: 'A-1037', customer: 'Omar Haddad', status: 'Pending', total: 899, date: '2025-04-29' },
  { id: 'A-1036', customer: 'Sara Lind', status: 'Paid', total: 599, date: '2025-04-28' },
  { id: 'A-1035', customer: 'Ravi Patel', status: 'Paid', total: 1498, date: '2025-04-27' },
]

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 })
const day = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

const columns: DataTableColumn<Order>[] = [
  { key: 'id', header: 'Order', sortable: true, cell: (o) => <span className="fp-num">{o.id}</span> },
  { key: 'customer', header: 'Customer', sortable: true },
  { key: 'status', header: 'Status', cell: (o) => <Badge variant={o.status === 'Paid' ? 'default' : 'outline'}>{o.status}</Badge> },
  { key: 'date', header: 'Date', sortable: true, cell: (o) => day.format(new Date(o.date)) },
  { key: 'total', header: 'Total', sortable: true, align: 'end', cell: (o) => <span className="fp-num">{money.format(o.total)}</span> },
]

export type DataTable01Props = {
  orders?: Order[]
  /** Called with the ids the user confirmed for deletion. The block removes them from its own list. */
  onDelete?: (ids: string[]) => void
}

/**
 * Orders list: search, status chips with counts, a sortable table with selection and paging,
 * and a confirmed bulk delete. Everything runs on the array in memory; swap the filter for a
 * request when the list lives on a server.
 */
export function DataTable01({ orders = SAMPLE, onDelete }: DataTable01Props) {
  const [rows, setRows] = React.useState(orders)
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState('All')
  const [selected, setSelected] = React.useState<string[]>([])
  const [page, setPage] = React.useState(1)

  const q = query.trim().toLowerCase()
  const matches = rows.filter((o) => !q || o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q))
  const shown = matches.filter((o) => status === 'All' || o.status === status)
  const count = (s: string) => matches.filter((o) => s === 'All' || o.status === s).length
  const filter = (fn: () => void) => { fn(); setPage(1) }

  const remove = () => {
    onDelete?.(selected)
    setRows(rows.filter((o) => !selected.includes(o.id)))
    setSelected([])
  }

  return (
    <div data-slot="block-data-table">
      <div data-slot="block-data-table-layout">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--fp-space-3)', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 0 }}>Orders</h2>
          <div style={{ width: 'min(100%, 280px)' }}>
            <InputGroup size="sm">
              <InputGroupAddon aria-hidden="true"><Search size={16} /></InputGroupAddon>
              <InputGroupInput aria-label="Search orders" placeholder="Search by name or order" value={query} onChange={(e) => filter(() => setQuery(e.target.value))} />
            </InputGroup>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--fp-space-3)', flexWrap: 'wrap', minHeight: 'var(--fp-control-sm)' }}>
          <ChipGroup
            aria-label="Status"
            size="sm"
            value={status}
            onValueChange={(v) => filter(() => setStatus(v))}
            options={['All', 'Paid', 'Pending', 'Refunded'].map((s) => ({ value: s, label: s, count: count(s) }))}
          />
          {selected.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-2)' }}>
              <span style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)' }} aria-live="polite">{selected.length} selected</span>
              <AlertDialog
                danger
                trigger={<Button size="sm" variant="outline"><Trash2 size={16} /> Delete</Button>}
                title={`Delete ${selected.length} ${selected.length === 1 ? 'order' : 'orders'}?`}
                description="They are removed from this list. This cannot be undone."
                confirmLabel="Delete"
                onConfirm={remove}
              />
            </div>
          )}
        </div>

        <DataTable
          aria-label="Orders"
          columns={columns}
          data={shown}
          getRowId={(o) => o.id}
          defaultSort={{ key: 'date', direction: 'desc' }}
          selectable
          selected={selected}
          onSelectedChange={setSelected}
          selectRowLabel={(o) => `Select order ${o.id}`}
          pageSize={5}
          page={page}
          onPageChange={setPage}
          empty={
            <Empty
              title="No matching orders"
              description="Try another name, or clear the filters."
              action={<Button size="sm" variant="outline" onClick={() => filter(() => { setQuery(''); setStatus('All') })}>Clear filters</Button>}
            />
          }
        />
      </div>
    </div>
  )
}
