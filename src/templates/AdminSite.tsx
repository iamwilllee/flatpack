import { useState } from 'react'
import {
  LayoutDashboard, ShoppingBag, Users, Settings as SettingsIcon, Bell, Plus,
  MoreHorizontal, Check, X, Menu, Download, Filter, ChevronRight,
  TrendingUp, CircleDot, AlertCircle, CheckCircle2, Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Statistic } from '@/components/ui/statistic'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Segmented } from '@/components/ui/segmented'
import { Pagination } from '@/components/ui/pagination'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table'
import { Sidebar, SidebarSection, SidebarItem } from '@/components/ui/sidebar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Alert } from '@/components/ui/alert'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Kicker, Separator } from '@/components/ui/primitives'
import { PHOTOS } from '@/site/photos'

type Page = 'overview' | 'orders' | 'customers' | 'settings'

type Order = { id: string; customer: string; amount: number; status: 'Done' | 'In progress' | 'Pending'; date: string; items: number }

const INITIAL: Order[] = [
  { id: '#1049', customer: 'Alex Wang', amount: 1299, status: 'Done', date: 'Nov 18', items: 2 },
  { id: '#1048', customer: 'Lea Li', amount: 499, status: 'In progress', date: 'Nov 18', items: 1 },
  { id: '#1047', customer: 'Jonas Berg', amount: 899, status: 'Pending', date: 'Nov 17', items: 3 },
  { id: '#1046', customer: 'Mei Chen', amount: 749, status: 'Done', date: 'Nov 17', items: 1 },
  { id: '#1045', customer: 'Lars Nilsson', amount: 199, status: 'Done', date: 'Nov 16', items: 2 },
  { id: '#1044', customer: 'Ines Silva', amount: 349, status: 'In progress', date: 'Nov 16', items: 1 },
  { id: '#1043', customer: 'Noah Park', amount: 599, status: 'Pending', date: 'Nov 15', items: 2 },
  { id: '#1042', customer: 'Ava Patel', amount: 129, status: 'Done', date: 'Nov 15', items: 1 },
]

const ACTIVITY = [
  { icon: <CheckCircle2 size={16} />, text: 'Order #1049 marked as done', time: '4m ago', tone: 'var(--fp-success)' },
  { icon: <CircleDot size={16} />, text: 'New order #1047 from Jonas Berg', time: '22m ago', tone: 'var(--fp-muted)' },
  { icon: <AlertCircle size={16} />, text: 'Stock low: Desk lamp (4 left)', time: '1h ago', tone: 'var(--fp-danger)' },
  { icon: <Package size={16} />, text: 'Shipment to Lea Li dispatched', time: '2h ago', tone: 'var(--fp-muted)' },
  { icon: <CheckCircle2 size={16} />, text: 'Weekly summary generated', time: '5h ago', tone: 'var(--fp-muted)' },
]

const CHART = [42, 58, 35, 72, 64, 88, 76, 95, 68, 84, 72, 98]

function BarChart({ values }: { values: number[] }) {
  const max = Math.max(...values)
  const plotH = 88
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--fp-space-1)', height: 120, paddingTop: 'var(--fp-space-2)' }}>
      {values.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--fp-space-1)', height: '100%', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', height: Math.max(4, (v / max) * plotH), background: i === values.length - 1 ? 'var(--fp-ink)' : 'var(--fp-line-strong)' }} title={`${v}k`} />
          <span style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', fontFamily: 'var(--fp-mono)', lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
        </div>
      ))}
    </div>
  )
}

export function AdminSite({ compact = false }: { compact?: boolean }) {
  const [page, setPage] = useState<Page>('overview')
  const [filter, setFilter] = useState('All')
  const [rows, setRows] = useState<Order[]>(INITIAL)
  const [selected, setSelected] = useState<string[]>([])
  const [pageNo, setPageNo] = useState(1)
  const [alerts, setAlerts] = useState(true)
  const [digest, setDigest] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 1800) }
  const go = (p: Page) => { setPage(p); setDrawerOpen(false) }
  const visible = rows.filter((r) => filter === 'All' || r.status === filter)
  const pageRows = visible.slice((pageNo - 1) * 5, pageNo * 5)
  const advance = (id: string) => {
    setRows((rs) => rs.map((r) => r.id === id ? { ...r, status: r.status === 'Pending' ? 'In progress' : r.status === 'In progress' ? 'Done' : 'Done' } : r))
    flash(`${id} advanced`)
  }
  const toggleAll = () => setSelected(selected.length === pageRows.length ? [] : pageRows.map((r) => r.id))
  const bulk = (status: Order['status']) => {
    setRows((rs) => rs.map((r) => selected.includes(r.id) ? { ...r, status } : r))
    flash(`${selected.length} orders → ${status}`)
    setSelected([])
  }

  const statusVariant = (s: Order['status']) => s === 'Done' ? 'outline' : s === 'In progress' ? 'default' : 'outline'

  return (
    <div style={{ display: compact ? 'block' : 'flex', minHeight: 700, background: 'var(--fp-bg)' }}>
      <div style={compact ? { display: 'none' } : { display: 'contents' }}>
      <Sidebar>
        <SidebarSection label={compact ? '' : 'Workspace'}>
          <SidebarItem active={page === 'overview'} icon={<LayoutDashboard size={16} />} onClick={() => go('overview')}>Overview</SidebarItem>
          <SidebarItem active={page === 'orders'} icon={<ShoppingBag size={16} />} onClick={() => go('orders')}>Orders <Badge variant="outline" style={{ marginLeft: 'auto' }}>3</Badge></SidebarItem>
          <SidebarItem active={page === 'customers'} icon={<Users size={16} />} onClick={() => go('customers')}>Customers</SidebarItem>
        </SidebarSection>
        <SidebarSection label={compact ? '' : 'System'}>
          <SidebarItem active={page === 'settings'} icon={<SettingsIcon size={16} />} onClick={() => go('settings')}>Settings</SidebarItem>
        </SidebarSection>
        <div style={{ marginTop: 'auto', padding: 'var(--fp-space-4)', borderTop: '1px solid var(--fp-line)', display: compact ? 'none' : undefined }}>
          <div style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)' }}>Northform workspace</div>
          <div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', marginTop: 'var(--fp-space-1)' }}>Team plan · 4 seats</div>
          <Progress value={68} size="sm" />
        </div>
      </Sidebar>
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', width: compact ? '100%' : undefined }}>
        {/* toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: compact ? 'var(--fp-space-3) var(--fp-space-3)' : 'var(--fp-space-4) var(--fp-space-5)', borderBottom: '1px solid var(--fp-line)', background: 'var(--fp-surface)' }}>
          <div>
            <div style={{ fontSize: 'var(--fp-text-sm)', fontWeight: 'var(--fp-weight-semibold)' }}>{page[0].toUpperCase() + page.slice(1)}</div>
            <div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>Northform workspace</div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--fp-space-2)', alignItems: 'center' }}>
            {compact && <Button size="icon-sm" variant="ghost" onClick={() => setDrawerOpen(true)} aria-label="Open menu"><Menu size={16} /></Button>}
            <Input size="sm" placeholder="Search" style={{ width: 170, display: compact ? 'none' : undefined }} />
            <Button size="icon-sm" variant="ghost" onClick={() => flash('No new notifications')} aria-label="Notifications"><Bell size={16} /></Button>
            <Dialog>
              <DialogTrigger size="sm" variant="default">New order</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create an order</DialogTitle>
                  <DialogDescription>Add a customer and an item to start a new order.</DialogDescription>
                </DialogHeader>
                <Input placeholder="Customer name" style={{ marginBottom: 'var(--fp-space-3)' }} />
                <Input placeholder="Item" />
                <DialogFooter>
                  <DialogClose>Cancel</DialogClose>
                  <DialogClose><Button size="sm" onClick={() => flash('Order draft created')}>Create</Button></DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Avatar name="Admin" size="sm" />
          </div>
        </div>

        {toast && (
          <div style={{ padding: 'var(--fp-space-3) var(--fp-space-5) 0' }}>
            <Alert variant="success" title="Done">{toast}</Alert>
          </div>
        )}

        <div style={{ flex: 1, padding: compact ? 'var(--fp-space-3)' : 'var(--fp-space-5)' }}>
          {page === 'overview' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--fp-space-4)', gap: 'var(--fp-space-3)', flexWrap: 'wrap' }}>
                <div><Kicker>Today · Nov 18</Kicker><div style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', marginTop: 'var(--fp-space-2)' }}>Here is what is happening in your workspace.</div></div>
                <div style={{ display: 'flex', gap: 'var(--fp-space-2)', alignItems: 'center' }}><span className="fp-label">Live</span><Button size="sm" variant="outline"><Download size={16} /> Export</Button></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: 'var(--fp-space-3)', marginBottom: 'var(--fp-space-4)' }}>
                <Card style={{ padding: 'var(--fp-space-4)' }}><Statistic label="Orders" value="1,472" trend={{ value: 12.4 }} hint="vs last month" /></Card>
                <Card style={{ padding: 'var(--fp-space-4)' }}><Statistic label="Revenue" value="89,120" prefix="¥" trend={{ value: 8.1 }} /></Card>
                <Card style={{ padding: 'var(--fp-space-4)' }}><Statistic label="Avg. order" value="684" prefix="¥" hint="this quarter" /></Card>
                <Card style={{ padding: 'var(--fp-space-4)' }}><Progress value={72} label="Monthly target" showValue /></Card>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1.5fr 1fr', gap: 'var(--fp-space-3)' }}>
                <Card style={{ padding: 'var(--fp-space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--fp-space-2)' }}>
                    <div><div className="fp-label">Revenue</div><div style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)' }}>¥ 89,120</div></div>
                    <span style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', display: 'flex', alignItems: 'center', gap: 'var(--fp-space-1)' }}><TrendingUp size={16} /> +8.1%</span>
                  </div>
                  <BarChart values={CHART} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', fontFamily: 'var(--fp-mono)', marginTop: 'var(--fp-space-1)' }}><span>Jan</span><span>Jun</span><span>Dec</span></div>
                </Card>
                <Card style={{ padding: 'var(--fp-space-4)' }}>
                  <div className="fp-label" style={{ marginBottom: 'var(--fp-space-3)' }}>Activity</div>
                  {ACTIVITY.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 'var(--fp-space-2)', alignItems: 'flex-start', padding: 'var(--fp-space-2) 0', borderBottom: i === ACTIVITY.length - 1 ? 0 : '1px solid var(--fp-line)' }}>
                      <span style={{ color: a.tone, marginTop: 'var(--fp-space-1)' }}>{a.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 'var(--fp-text-xs)', lineHeight: 1.4 }}>{a.text}</div>
                        <div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
              <Card style={{ padding: 0, marginTop: 'var(--fp-space-3)' }}>
                <Table>
                  <TableCaption>Recent orders</TableCaption>
                  <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {rows.slice(0, 4).map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.id}</TableCell><TableCell>{r.customer}</TableCell><TableCell>¥ {r.amount.toLocaleString()}</TableCell>
                        <TableCell><Badge variant={statusVariant(r.status)}>{r.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </>
          )}

          {page === 'orders' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--fp-space-4)' }}>
                <div style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)' }}>Track fulfilment and update order status.</div>
                <div style={{ display: 'flex', gap: 'var(--fp-space-2)' }}>
                  <Button size="sm" variant="outline" onClick={() => flash('Filters applied')}><Filter size={16} /> Filter</Button>
                  <Button size="sm" variant="outline" onClick={() => flash('Orders exported')}><Download size={16} /> Export</Button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--fp-space-3)', gap: 'var(--fp-space-3)', flexWrap: 'wrap' }}>
                <Segmented value={filter} onValueChange={(v) => { setFilter(v); setPageNo(1) }} options={['All', 'Done', 'In progress', 'Pending'].map((s) => ({ value: s, label: s }))} />
                {selected.length > 0 && (
                  <div style={{ display: 'flex', gap: 'var(--fp-space-2)', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>{selected.length} selected</span>
                    <Button size="sm" variant="outline" onClick={() => bulk('Done')}>Mark done</Button>
                    <Button size="icon-sm" variant="ghost" onClick={() => setSelected([])} aria-label="Clear selection"><X size={16} /></Button>
                  </div>
                )}
              </div>
              <Card style={{ padding: 0, overflowX: 'auto' }}>
                <Table>
                  <TableCaption>{visible.length} orders · page {pageNo}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: 32 }}><Checkbox checked={selected.length === pageRows.length && pageRows.length > 0} indeterminate={selected.length > 0 && selected.length < pageRows.length} onCheckedChange={toggleAll} /></TableHead>
                      <TableHead>Order</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead><TableHead>Items</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell><Checkbox checked={selected.includes(r.id)} onCheckedChange={() => setSelected((s) => s.includes(r.id) ? s.filter((x) => x !== r.id) : [...s, r.id])} /></TableCell>
                        <TableCell style={{ fontWeight: 'var(--fp-weight-semibold)' }}>{r.id}</TableCell><TableCell>{r.date}</TableCell><TableCell>{r.customer}</TableCell>
                        <TableCell>{r.items}</TableCell><TableCell>¥ {r.amount.toLocaleString()}</TableCell>
                        <TableCell><Badge variant={statusVariant(r.status)}>{r.status}</Badge></TableCell>
                        <TableCell><Button size="icon-sm" variant="ghost" onClick={() => advance(r.id)} title="Advance status" disabled={r.status === 'Done'}>{r.status === 'Done' ? <Check size={16} /> : <ChevronRight size={16} />}</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--fp-space-4)' }}>
                <span style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>Showing {pageRows.length} of {visible.length}</span>
                <Pagination total={visible.length} pageSize={5} value={pageNo} onValueChange={setPageNo} />
              </div>
            </>
          )}

          {page === 'customers' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--fp-space-4)' }}>
                <div><Kicker>People</Kicker><div style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', marginTop: 'var(--fp-space-2)' }}>Everyone who has ordered from your store.</div></div>
                <Button size="sm" onClick={() => flash('Invite sent')}><Plus size={16} /> Invite</Button>
              </div>
              <Card style={{ padding: 0 }}>
                {['Alex Wang', 'Lea Li', 'Jonas Berg', 'Mei Chen', 'Lars Nilsson', 'Ines Silva'].map((n, i) => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)', padding: 'var(--fp-space-3) var(--fp-space-4)', borderBottom: i === 5 ? 0 : '1px solid var(--fp-line)' }}>
                    <img src={PHOTOS[`face${i + 1}` as keyof typeof PHOTOS]} alt={n} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--fp-line)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)' }}>{n}</div>
                      <div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>{n.toLowerCase().replace(' ', '.')}@example.com</div>
                    </div>
                    <span style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', display: compact ? 'none' : undefined }}>{[28, 14, 9, 21, 6, 12][i]} orders</span>
                    <Badge variant={i < 3 ? 'default' : 'outline'}>{i < 3 ? 'Active' : 'Idle'}</Badge>
                    <Button size="icon-sm" variant="ghost" onClick={() => flash(`Viewing ${n}`)} aria-label={`More for ${n}`}><MoreHorizontal size={16} /></Button>
                  </div>
                ))}
              </Card>
            </>
          )}

          {page === 'settings' && (
            <>
              <Kicker>Preferences</Kicker>
              <div style={{ fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)', margin: 'var(--fp-space-2) 0 var(--fp-space-4)' }}>Manage your workspace, notifications and team.</div>
              <Card style={{ padding: compact ? 'var(--fp-space-4)' : 'var(--fp-space-5)', maxWidth: compact ? '100%' : 600 }}>
                <Tabs defaultValue="general">
                  <TabsList><TabsTrigger value="general">General</TabsTrigger><TabsTrigger value="notifications">Notifications</TabsTrigger><TabsTrigger value="team">Team</TabsTrigger></TabsList>
                  <TabsContent value="general"><div style={{ paddingTop: 'var(--fp-space-4)' }}>
                    <label style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)', display: 'block', marginBottom: 'var(--fp-space-2)' }}>Workspace name</label>
                    <Input defaultValue="Northform" style={{ marginBottom: 'var(--fp-space-4)' }} />
                    <label style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)', display: 'block', marginBottom: 'var(--fp-space-2)' }}>Contact email</label>
                    <Input defaultValue="ops@nordform.example" style={{ marginBottom: 'var(--fp-space-4)' }} />
                    <Button size="sm" onClick={() => flash('Settings saved')}>Save changes</Button>
                  </div></TabsContent>
                  <TabsContent value="notifications"><div style={{ paddingTop: 'var(--fp-space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-4)' }}>
                    <Switch checked={alerts} onCheckedChange={setAlerts} label="Order alerts" />
                    <Switch checked={digest} onCheckedChange={setDigest} label="Weekly digest" />
                    <Switch defaultChecked label="Low stock warnings" />
                    <Separator />
                    <Button size="sm" variant="outline" onClick={() => flash('Notification settings saved')}>Save preferences</Button>
                  </div></TabsContent>
                  <TabsContent value="team"><div style={{ paddingTop: 'var(--fp-space-4)' }}>
                    {['Alex Wang', 'Mei Chen', 'Jonas Berg'].map((n) => (
                      <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)', padding: 'var(--fp-space-2) 0', borderBottom: '1px solid var(--fp-line)' }}>
                        <Avatar name={n} size="sm" /><span style={{ flex: 1, fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)' }}>{n}</span><Badge variant="outline">Editor</Badge>
                      </div>
                    ))}
                    <Button size="sm" style={{ marginTop: 'var(--fp-space-4)' }} onClick={() => flash('Invite sent')}><Plus size={16} /> Invite member</Button>
                  </div></TabsContent>
                </Tabs>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* mobile drawer: a real off-canvas sidebar, not a squashed top bar */}
      {compact && drawerOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 80 }}>
          <div onClick={() => setDrawerOpen(false)} style={{ position: 'absolute', inset: 0, background: 'var(--fp-scrim)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 240, background: 'var(--fp-surface)', borderRight: '1px solid var(--fp-line)', display: 'flex', flexDirection: 'column',}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--fp-space-4) var(--fp-space-4)', borderBottom: '1px solid var(--fp-line)' }}>
              <span style={{ fontWeight: 'var(--fp-weight-semibold)', fontSize: 'var(--fp-text-sm)' }}>Northform</span>
              <Button size="icon-sm" variant="ghost" onClick={() => setDrawerOpen(false)} aria-label="Close menu"><X size={16} /></Button>
            </div>
            <Sidebar>
              <SidebarSection label="Workspace">
                <SidebarItem active={page === 'overview'} icon={<LayoutDashboard size={16} />} onClick={() => go('overview')}>Overview</SidebarItem>
                <SidebarItem active={page === 'orders'} icon={<ShoppingBag size={16} />} onClick={() => go('orders')}>Orders <Badge variant="outline" style={{ marginLeft: 'auto' }}>3</Badge></SidebarItem>
                <SidebarItem active={page === 'customers'} icon={<Users size={16} />} onClick={() => go('customers')}>Customers</SidebarItem>
              </SidebarSection>
              <SidebarSection label="System">
                <SidebarItem active={page === 'settings'} icon={<SettingsIcon size={16} />} onClick={() => go('settings')}>Settings</SidebarItem>
              </SidebarSection>
            </Sidebar>
            <div style={{ marginTop: 'auto', padding: 'var(--fp-space-4)', borderTop: '1px solid var(--fp-line)' }}>
              <div style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)' }}>Northform workspace</div>
              <div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)', marginTop: 'var(--fp-space-1)' }}>Team plan · 4 seats</div>
              <Progress value={68} size="sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
