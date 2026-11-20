import {
  ShoppingBag, Heart, User, Package, ChevronRight,
  Paperclip, ArrowUp, Search, FileCode, Plus, MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Image } from '@/components/ui/image'
import { Avatar } from '@/components/ui/avatar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbCurrent, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Segmented } from '@/components/ui/segmented'
import { Statistic } from '@/components/ui/statistic'
import { Progress } from '@/components/ui/progress'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup } from '@/components/ui/radio'
import { Divider } from '@/components/ui/divider'
import { Sidebar, SidebarSection, SidebarItem } from '@/components/ui/sidebar'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { Kbd } from '@/components/ui/kbd'
import { StatusDot } from '@/components/ui/status-dot'

const frame: React.CSSProperties = { background: 'var(--fp-bg)', padding: 'var(--fp-space-5)', minHeight: 420 }
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const muted: React.CSSProperties = { color: 'var(--fp-muted)', fontSize: 'var(--fp-text-xs)' }

const products = [
  { name: 'Side table', price: '¥ 499', tag: 'New' },
  { name: 'Wool rug', price: '¥ 899', tag: '' },
  { name: 'Shelf', price: '¥ 199', tag: 'Low price' },
  { name: 'Armchair', price: '¥ 749', tag: '' },
  { name: 'Oak bed', price: '¥ 1,299', tag: 'Popular' },
  { name: 'Bookcase', price: '¥ 599', tag: '' },
]

// ---------- 01 Storefront ----------
export function Storefront() {
  return (
    <div style={frame}>
      <div style={{ ...row, paddingBottom: 'var(--fp-space-4)', borderBottom: '1px solid var(--fp-line)' }}>
        <strong style={{ fontSize: 'var(--fp-text-base)' }}>Flatpack Home</strong>
        <div style={{ display: 'flex', gap: 'var(--fp-space-4)', ...muted }}><span>All products</span><span>Rooms</span><span>New</span></div>
        <div style={{ display: 'flex', gap: 'var(--fp-space-2)' }}><Input size="sm" placeholder="Search" style={{ width: 150 }} /><Button size="icon-sm" variant="outline" aria-label="Cart"><ShoppingBag size={16} /></Button></div>
      </div>
      <h3 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 'var(--fp-space-4) 0 var(--fp-space-1)' }}>Browse all products</h3>
      <div style={{ display: 'flex', gap: 'var(--fp-space-2)', margin: 'var(--fp-space-3) 0 var(--fp-space-4)', flexWrap: 'wrap' }}>
        {['All', 'Living room', 'Bedroom', 'Kitchen', 'Study'].map((x, i) => <Badge key={x} variant={i === 0 ? 'default' : 'outline'}>{x}</Badge>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--fp-space-3)' }}>
        {products.map((p) => (
          <Card key={p.name}>
            <CardContent style={{ padding: 'var(--fp-space-3)' }}>
              <Image ratio="4:3" alt={p.name} />
              <div style={{ ...row, marginTop: 'var(--fp-space-2)' }}>
                <div><div style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)' }}>{p.name}</div><strong style={{ fontSize: 'var(--fp-text-sm)' }}>{p.price}</strong></div>
                {p.tag && <Badge>{p.tag}</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ---------- 02 Product detail ----------
export function ProductDetail() {
  return (
    <div style={frame}>
      <Breadcrumb>
        <BreadcrumbItem><BreadcrumbLink>Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink>Bedroom</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbCurrent>Beds & mattresses</BreadcrumbCurrent></BreadcrumbItem>
      </Breadcrumb>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--fp-space-6)', marginTop: 'var(--fp-space-4)' }}>
        <Image ratio="4:3" alt="Oak bed" />
        <div>
          <div style={{ fontSize: 'var(--fp-text-xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)' }}>Oak bed</div>
          <div style={{ ...muted, margin: 'var(--fp-space-2) 0 var(--fp-space-4)' }}>Oak / 150 × 200 cm · 304.492</div>
          <div style={{ fontSize: 'var(--fp-text-xl)', fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-4)' }}>¥ 1,299</div>
          <div style={{ display: 'flex', gap: 'var(--fp-space-2)', marginBottom: 'var(--fp-space-4)' }}>
            <Button>Add to cart <ShoppingBag size={16} /></Button>
            <Button size="icon" variant="outline" aria-label="Save to wishlist"><Heart size={16} /></Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)', padding: 'var(--fp-space-3)', border: '1px solid var(--fp-line)',}}>
            <Avatar name="Alex Wang" size="sm" /><span style={muted}>"Ten minutes to assemble — solid." — Verified buyer</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------- 03 Cart & checkout ----------
const cartItems = [
  { name: 'Side table', price: 499, qty: '1' },
  { name: 'Wool rug', price: 899, qty: '1' },
  { name: 'Armchair', price: 749, qty: '2' },
]
export function CartCheckout() {
  const total = cartItems.reduce((s, i) => s + i.price * Number(i.qty), 0)
  return (
    <div style={frame}>
      <h3 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: '0 0 var(--fp-space-4)' }}>Cart</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--fp-space-5)', alignItems: 'start' }}>
        <Card style={{ padding: 0 }}>
          {cartItems.map((i, n) => (
            <div key={i.name} style={{ ...row, flexWrap: 'wrap', gap: 'var(--fp-space-3)', padding: 'var(--fp-space-4)', borderBottom: n < cartItems.length - 1 ? '1px solid var(--fp-line)' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)' }}>
                <div style={{ width: 60 }}><Image ratio="square" alt={i.name} /></div>
                <div><div style={{ fontSize: 'var(--fp-text-sm)', fontWeight: 'var(--fp-weight-semibold)' }}>{i.name}</div><div style={muted}>¥ {i.price}</div></div>
              </div>
              <Segmented size="sm" defaultValue={i.qty} options={['1', '2', '3'].map((n) => ({ value: n, label: n }))} />
            </div>
          ))}
        </Card>
        <Card style={{ padding: 'var(--fp-space-4)' }}>
          <div className="fp-label" style={{ marginBottom: 'var(--fp-space-3)' }}>Order summary</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fp-text-xs)', marginBottom: 'var(--fp-space-2)' }}><span style={{ color: 'var(--fp-muted)' }}>Subtotal</span><span>¥ {total.toLocaleString()}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fp-text-xs)', marginBottom: 'var(--fp-space-2)' }}><span style={{ color: 'var(--fp-muted)' }}>Shipping</span><span>Free</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 'var(--fp-space-3)', paddingTop: 'var(--fp-space-3)', borderTop: '1px solid var(--fp-line)' }}>
            <span className="fp-label">Total</span><strong style={{ fontSize: 'var(--fp-text-xl)', letterSpacing: 'var(--fp-tracking-display)' }}>¥ {total.toLocaleString()}</strong>
          </div>
          <div style={{ display: 'flex', gap: 'var(--fp-space-2)', marginTop: 'var(--fp-space-4)' }}>
            <Input size="sm" placeholder="Promo code" style={{ flex: 1 }} />
            <Button size="sm" variant="outline">Apply</Button>
          </div>
          <Button style={{ width: '100%', marginTop: 'var(--fp-space-3)' }}>Checkout <ChevronRight size={16} /></Button>
          <div style={{ ...muted, marginTop: 'var(--fp-space-3)', textAlign: 'center', fontSize: 'var(--fp-text-xs)' }}>Free shipping over ¥199 · 365-day returns</div>
        </Card>
      </div>
    </div>
  )
}

// ---------- 04 Dashboard ----------
export function Dashboard() {
  return (
    <div style={{ display: 'flex', gap: 'var(--fp-space-4)', background: 'var(--fp-bg)', minHeight: 420 }}>
      <Sidebar>
        <SidebarSection label="Overview">
          <SidebarItem active icon={<Package size={16} />}>Overview</SidebarItem>
          <SidebarItem icon={<ShoppingBag size={16} />}>Orders</SidebarItem>
          <SidebarItem icon={<User size={16} />}>Customers</SidebarItem>
        </SidebarSection>
      </Sidebar>
      <div style={{ flex: 1, padding: 'var(--fp-space-5)', minWidth: 0 }}>
        <div style={row}><h3 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', margin: 0, letterSpacing: 'var(--fp-tracking-display)' }}>Overview</h3><span className="fp-label">Live</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--fp-space-3)', margin: 'var(--fp-space-4) 0' }}>
          <Card style={{ padding: 'var(--fp-space-4)' }}><Statistic label="Orders" value="1,472" trend={{ value: 12.4 }} hint="vs last month" /></Card>
          <Card style={{ padding: 'var(--fp-space-4)' }}><Statistic label="Revenue" value="89,120" prefix="¥" trend={{ value: 8.1 }} /></Card>
          <Card style={{ padding: 'var(--fp-space-4)', gridColumn: '1 / -1' }}><Progress value={72} label="Target progress" showValue /></Card>
        </div>
        <Card style={{ padding: 0 }}>
          <Table>
            <TableCaption>Recent orders</TableCaption>
            <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              <TableRow><TableCell>#1042</TableCell><TableCell>Alex Wang</TableCell><TableCell>¥ 1,299</TableCell><TableCell><Badge variant="outline">Done</Badge></TableCell></TableRow>
              <TableRow><TableCell>#1041</TableCell><TableCell>Lea Li</TableCell><TableCell>¥ 499</TableCell><TableCell><Badge>In progress</Badge></TableCell></TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}

// ---------- 05 Login ----------
export function Login() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 420, background: 'var(--fp-bg)' }}>
      <div className="fp-invert" style={{ padding: 'var(--fp-space-7)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 'var(--fp-weight-semibold)', fontSize: 'var(--fp-text-base)' }}>Flatpack</div>
        <div>
          <div style={{ fontSize: 'var(--fp-text-2xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', lineHeight: 1.1 }}>Build with clarity.</div>
          <p style={{ color: 'var(--fp-muted)', marginTop: 'var(--fp-space-3)', fontSize: 'var(--fp-text-sm)' }}>Square corners, black and white, plenty of space.</p>
        </div>
        <div className="fp-label">63 components · 2 themes</div>
      </div>
      <div style={{ padding: 'var(--fp-space-8) var(--fp-space-7)' }}>
        <h3 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', margin: '0 0 var(--fp-space-2)' }}>Sign in</h3>
        <p style={muted}>Welcome back. Enter your details.</p>
        <div style={{ marginTop: 'var(--fp-space-5)' }}>
          <label style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)', display: 'block', marginBottom: 'var(--fp-space-2)' }}>Email</label>
          <Input type="email" placeholder="you@example.com" style={{ marginBottom: 'var(--fp-space-4)' }} />
          <label style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)', display: 'block', marginBottom: 'var(--fp-space-2)' }}>Password</label>
          <Input type="password" placeholder="••••••••" style={{ marginBottom: 'var(--fp-space-4)' }} />
          <Checkbox defaultChecked label="Remember me" />
          <Button style={{ width: '100%', marginTop: 'var(--fp-space-4)' }}>Sign in</Button>
          <div style={{ margin: 'var(--fp-space-4) 0' }}><Divider label="or" /></div>
          <Button variant="outline" style={{ width: '100%' }}>Continue with another method</Button>
        </div>
      </div>
    </div>
  )
}

// ---------- 06 Settings ----------
export function Settings() {
  return (
    <div style={{ display: 'flex', gap: 'var(--fp-space-5)', background: 'var(--fp-bg)', minHeight: 420, padding: 'var(--fp-space-5)' }}>
      <Sidebar>
        <SidebarSection label="Account">
          {['Profile', 'Notifications', 'Security', 'Billing'].map((s, i) => (
            <SidebarItem key={s} active={i === 0}>{s}</SidebarItem>
          ))}
        </SidebarSection>
      </Sidebar>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', margin: '0 0 var(--fp-space-4)', letterSpacing: 'var(--fp-tracking-display)' }}>Profile</h3>
        <Card>
          <CardHeader><CardTitle>Basic info</CardTitle><CardDescription>Update your public profile.</CardDescription></CardHeader>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)', marginBottom: 'var(--fp-space-4)' }}><Avatar name="Alex Wang" size="lg" /><Button size="sm" variant="outline">Change photo</Button></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--fp-space-3)' }}>
              <div><label style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)', display: 'block', marginBottom: 'var(--fp-space-2)' }}>Name</label><Input defaultValue="Alex Wang" /></div>
              <div><label style={{ fontSize: 'var(--fp-text-xs)', fontWeight: 'var(--fp-weight-semibold)', display: 'block', marginBottom: 'var(--fp-space-2)' }}>Email</label><Input defaultValue="wang@example.com" /></div>
            </div>
            <div style={{ marginTop: 'var(--fp-space-4)' }}>
              <div className="fp-label" style={{ marginBottom: 'var(--fp-space-3)' }}>Preferences</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-3)' }}>
                <Switch defaultChecked label="New arrivals" />
                <RadioGroup defaultValue="dark" options={[{ value: 'light', label: 'Light theme' }, { value: 'dark', label: 'Dark theme' }]} />
              </div>
            </div>
          </CardContent>
          <CardFooter><Button size="sm">Save changes</Button><Button size="sm" variant="ghost">Cancel</Button></CardFooter>
        </Card>
      </div>
    </div>
  )
}

// ---------- 07 AI assistant ----------
// Chat parts (message, tool call, thinking, diff, composer) live here as a block
// until their API settles; then they become components.
function ChatMessage({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  return (
    <div data-slot="chat-message" data-role={role}>
      {role === 'assistant' ? <Avatar name="AI" size="sm" /> : <Avatar name="Alex Wang" size="sm" />}
      <div data-slot="chat-bubble">{children}</div>
    </div>
  )
}

export function Assistant() {
  return (
    <div style={{ display: 'flex', background: 'var(--fp-bg)', minHeight: 520 }}>
      <Sidebar>
        <div style={{ padding: 'var(--fp-space-3)' }}><Button size="sm" variant="outline" style={{ width: '100%' }}><Plus size={16} /> New chat</Button></div>
        <SidebarSection label="Today">
          <SidebarItem active icon={<MessageSquare size={16} />}>Restock plan</SidebarItem>
          <SidebarItem icon={<MessageSquare size={16} />}>Return policy copy</SidebarItem>
        </SidebarSection>
        <SidebarSection label="Last week">
          <SidebarItem icon={<MessageSquare size={16} />}>Q4 price check</SidebarItem>
        </SidebarSection>
      </Sidebar>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ ...row, padding: 'var(--fp-space-3) var(--fp-space-5)', borderBottom: '1px solid var(--fp-line)' }}>
          <strong style={{ fontSize: 'var(--fp-text-sm)' }}>Restock plan</strong>
          <StatusDot status="success">Connected to inventory</StatusDot>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-5)', padding: 'var(--fp-space-5)', maxWidth: 720, width: '100%', margin: '0 auto' }}>
          <ChatMessage role="user">Which chairs are below 10 units? Lower the reorder point for the armchair to 6.</ChatMessage>
          <ChatMessage role="assistant">
            <div data-slot="chat-tool"><Search size={16} /> Searched inventory · <span className="fp-num">3</span> results</div>
            <p style={{ margin: 'var(--fp-space-3) 0' }}>Three chairs are low: the armchair (<span className="fp-num">4</span>), the lounge chair (<span className="fp-num">7</span>) and the oak stool (<span className="fp-num">9</span>). I changed the armchair rule:</p>
            <div style={{ background: 'var(--fp-surface)', padding: 'var(--fp-space-2) 0' }}>
              <div style={{ ...muted, display: 'flex', alignItems: 'center', gap: 'var(--fp-space-2)', padding: '0 var(--fp-space-3) var(--fp-space-2)' }}><FileCode size={16} /> rules/armchair.json</div>
              <span data-slot="diff-line" data-kind="del">-  "reorderPoint": 10,</span>
              <span data-slot="diff-line" data-kind="add">+  "reorderPoint": 6,</span>
              <span data-slot="diff-line">   "supplier": "Nordic Wood"</span>
            </div>
          </ChatMessage>
          <ChatMessage role="assistant">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--fp-space-2)', color: 'var(--fp-muted)' }}><Spinner /> Drafting the purchase order…</span>
          </ChatMessage>
        </div>
        <div style={{ padding: 'var(--fp-space-4) var(--fp-space-5) var(--fp-space-5)', maxWidth: 720, width: '100%', margin: '0 auto' }}>
          <div data-slot="chat-composer">
            <Textarea placeholder="Ask about stock, orders or customers" aria-label="Message" />
            <div data-slot="chat-composer-bar">
              <span style={{ ...muted, display: 'inline-flex', alignItems: 'center', gap: 'var(--fp-space-2)' }}><Kbd>⏎</Kbd> send · <Kbd>⇧⏎</Kbd> new line</span>
              <div style={{ display: 'flex', gap: 'var(--fp-space-1)' }}>
                <Button size="icon" variant="ghost" aria-label="Attach"><Paperclip size={16} /></Button>
                <Button size="icon" aria-label="Send"><ArrowUp size={16} /></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const screenMap: Record<string, React.ComponentType> = {
  assistant: Assistant,
  storefront: Storefront,
  'product-detail': ProductDetail,
  cart: CartCheckout,
  dashboard: Dashboard,
  login: Login,
  settings: Settings,
}