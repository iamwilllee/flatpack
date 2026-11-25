/* ===== Flatpack UI — component showcase ===== */
import { useState } from 'react'
import {
  Check, Search, ShoppingBag, Code2, Copy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input, Label } from '@/components/ui/input'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table'
import { Kicker } from '@/components/ui/primitives'
import { SidebarItem } from '@/components/ui/sidebar'
import { Masonry } from '@/components/ui/masonry'
import { useI18n } from '@/site/i18n'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbCurrent, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Image } from '@/components/ui/image'
import { Avatar } from '@/components/ui/avatar'
import { Empty } from '@/components/ui/empty'
import { Steps } from '@/components/ui/steps'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup } from '@/components/ui/radio'
import { Switch } from '@/components/ui/switch'
import { Alert } from '@/components/ui/alert'
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'
import { Tooltip } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Segmented } from '@/components/ui/segmented'
import { Divider } from '@/components/ui/divider'
import { Statistic } from '@/components/ui/statistic'
import { Collapse } from '@/components/ui/collapse'
import { Pagination } from '@/components/ui/pagination'
import { docs } from '@/site/componentDocs'
import { ExtraDemo, EXTRA_IDS } from '@/site/DocDemosExtra'
import { ComponentIcon } from '@/site/componentIcons'

const extraDocs = EXTRA_IDS.map((id) => docs.find((d) => d.id === id)!).filter(Boolean)

const sections = [
  { id: 'buttons', label: 'Button', icon: <ComponentIcon id="buttons" /> },
  { id: 'card', label: 'Card', icon: <ComponentIcon id="card" /> },
  { id: 'badge', label: 'Badge', icon: <ComponentIcon id="badge" /> },
  { id: 'input', label: 'Input', icon: <ComponentIcon id="input" /> },
  { id: 'dialog', label: 'Dialog', icon: <ComponentIcon id="dialog" /> },
  { id: 'tabs', label: 'Tabs', icon: <ComponentIcon id="tabs" /> },
  { id: 'sheet', label: 'Sheet', icon: <ComponentIcon id="sheet" /> },
  { id: 'dropdown-menu', label: 'Dropdown', icon: <ComponentIcon id="dropdown-menu" /> },
  { id: 'table', label: 'Table', icon: <ComponentIcon id="table" /> },
  { id: 'breadcrumb', label: 'Breadcrumb', icon: <ComponentIcon id="breadcrumb" /> },
  { id: 'image', label: 'Image', icon: <ComponentIcon id="image" /> },
  { id: 'avatar', label: 'Avatar', icon: <ComponentIcon id="avatar" /> },
  { id: 'empty', label: 'Empty', icon: <ComponentIcon id="empty" /> },
  { id: 'steps', label: 'Steps', icon: <ComponentIcon id="steps" /> },
  { id: 'select', label: 'Select', icon: <ComponentIcon id="select" /> },
  { id: 'checkbox', label: 'Checkbox', icon: <ComponentIcon id="checkbox" /> },
  { id: 'radio', label: 'Radio', icon: <ComponentIcon id="radio" /> },
  { id: 'switch', label: 'Switch', icon: <ComponentIcon id="switch" /> },
  { id: 'alert', label: 'Alert', icon: <ComponentIcon id="alert" /> },
  { id: 'skeleton', label: 'Skeleton', icon: <ComponentIcon id="skeleton" /> },
  { id: 'tooltip', label: 'Tooltip', icon: <ComponentIcon id="tooltip" /> },
  { id: 'progress', label: 'Progress', icon: <ComponentIcon id="progress" /> },
  { id: 'popover', label: 'Popover', icon: <ComponentIcon id="popover" /> },
  { id: 'segmented', label: 'Segmented', icon: <ComponentIcon id="segmented" /> },
  { id: 'divider', label: 'Divider', icon: <ComponentIcon id="divider" /> },
  { id: 'statistic', label: 'Statistic', icon: <ComponentIcon id="statistic" /> },
  { id: 'collapse', label: 'Collapse', icon: <ComponentIcon id="collapse" /> },
  { id: 'pagination', label: 'Pagination', icon: <ComponentIcon id="pagination" /> },
  { id: 'masonry', label: 'Masonry', icon: <ComponentIcon id="masonry" /> },
  ...extraDocs.map((d) => ({ id: d.id, label: d.title, icon: <ComponentIcon id={d.id} /> })),
]

const CODES: Record<string, string> = {
  "cmp-buttons": "<Button>Primary</Button>\n<Button variant=\"secondary\">Secondary</Button>\n<Button variant=\"outline\">Outline</Button>\n<Button variant=\"ghost\">Ghost</Button>\n<Button variant=\"link\">Link</Button>\n<Button size=\"sm\">Small</Button>\n<Button size=\"icon\"><Search size={16} /></Button>",
  "cmp-badge": "<Badge>New</Badge>\n<Badge variant=\"blue\">On sale</Badge>\n<Badge variant=\"data\">LIVE 04</Badge>\n<Badge variant=\"outline\">Done</Badge>",
  "cmp-card": "<Card>\n  <CardHeader>\n    <CardTitle>Side table</CardTitle>\n    <CardDescription>Aluminium / 65 × 65 cm</CardDescription>\n  </CardHeader>\n  <CardContent>\n    <Image ratio=\"4:3\" alt=\"Side table\" src=\"/product.jpg\" />\n  </CardContent>\n  <CardFooter>\n    <strong>¥ 499</strong>\n    <Button size=\"sm\">Add to cart</Button>\n  </CardFooter>\n</Card>",
  "cmp-input": "<Label>Room name</Label>\n<Input placeholder=\"e.g. Living room\" />\n\n<Label>Dimensions (cm)</Label>\n<Input defaultValue=\"65 × 65\" />",
  "cmp-dialog": "<Dialog>\n  <DialogTrigger>Open instructions</DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>Confirm configuration</DialogTitle>\n      <DialogDescription>\n        Check each setting before you continue.\n      </DialogDescription>\n    </DialogHeader>\n    <DialogFooter>\n      <DialogClose>Back</DialogClose>\n      <DialogClose><Button>Next</Button></DialogClose>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>",
  "cmp-tabs": "<Tabs defaultValue=\"spec\">\n  <TabsList>\n    <TabsTrigger value=\"spec\">Specs</TabsTrigger>\n    <TabsTrigger value=\"review\">Reviews</TabsTrigger>\n    <TabsTrigger value=\"care\">Care</TabsTrigger>\n  </TabsList>\n  <TabsContent value=\"spec\">Solid wood frame, 30 kg capacity.</TabsContent>\n  <TabsContent value=\"review\">\"Ten minutes to assemble.\"</TabsContent>\n  <TabsContent value=\"care\">Wipe with a clean soft cloth.</TabsContent>\n</Tabs>",
  "cmp-sheet": "<Sheet>\n  <SheetTrigger>Cart (2)</SheetTrigger>\n  <SheetContent title=\"Cart\">\n    {/* Cart items */}\n    <Button style={{ width: '100%' }}>Checkout</Button>\n  </SheetContent>\n</Sheet>",
  "cmp-dropdown-menu": "<DropdownMenu>\n  <DropdownMenuTrigger>Categories</DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuItem>Living room</DropdownMenuItem>\n    <DropdownMenuItem>Bedroom</DropdownMenuItem>\n    <DropdownMenuSeparator />\n    <DropdownMenuItem>Office</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>",
  "cmp-table": "<Table>\n  <TableCaption>Item list</TableCaption>\n  <TableHeader>\n    <TableRow>\n      <TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Status</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow>\n      <TableCell>Monitor</TableCell><TableCell>1</TableCell>\n      <TableCell><Badge variant=\"outline\">Done</Badge></TableCell>\n    </TableRow>\n  </TableBody>\n</Table>",
  "cmp-breadcrumb": "<Breadcrumb>\n  <BreadcrumbItem><BreadcrumbLink>Home</BreadcrumbLink></BreadcrumbItem>\n  <BreadcrumbSeparator />\n  <BreadcrumbItem><BreadcrumbLink>Bedroom</BreadcrumbLink></BreadcrumbItem>\n  <BreadcrumbSeparator />\n  <BreadcrumbItem><BreadcrumbCurrent>Beds & mattresses</BreadcrumbCurrent></BreadcrumbItem>\n</Breadcrumb>",
  "cmp-image": "<Image ratio=\"square\" alt=\"Square\" src=\"/product.jpg\" />\n<Image ratio=\"4:3\" alt=\"4:3\" src=\"/room.jpg\" />\n<Image ratio=\"3:4\" alt=\"3:4\" src=\"/detail.jpg\" />\n\n{/* Falls back to the alt placeholder if loading fails; 16:9 is supported too */}",
  "cmp-avatar": "<Avatar size=\"sm\" name=\"Li\" />\n<Avatar size=\"md\" name=\"Ming Wang\" />\n<Avatar size=\"lg\" name=\"Anna\" src=\"/avatar.jpg\" />\n\n{/* Uses initials without an image, and degrades gracefully on load errors */}",
  "cmp-empty": "<Empty\n  title=\"No results found\"\n  description=\"Try another category or adjust your filters.\"\n  action={<Button size=\"sm\">Clear filters</Button>}\n/>",
  "cmp-steps": "<Steps\n  current={1}\n  steps={[\n    { title: 'Create project', description: 'Enter project details' },\n    { title: 'Configure', description: 'Set core parameters' },\n    { title: 'Publish', description: 'Confirm and save' },\n    { title: 'Done' },\n  ]}\n/>",
  "cmp-select": "<Select\n  options={[\n    { value: 'living', label: 'Living room' },\n    { value: 'bedroom', label: 'Bedroom' },\n    { value: 'kitchen', label: 'Kitchen' },\n  ]}\n  defaultValue=\"living\"\n  onValueChange={(value) => console.log(value)}\n/>",
  "cmp-checkbox": "<Checkbox defaultChecked label=\"Sofa\" />\n<Checkbox label=\"Table\" />\n<Checkbox indeterminate label=\"Rug\" />\n<Checkbox disabled defaultChecked label=\"Archived\" />",
  "cmp-radio": "<RadioGroup\n  defaultValue=\"standard\"\n  options={[\n    { value: 'standard', label: 'Standard (3–5 days)' },\n    { value: 'express', label: 'Express (next day)' },\n    { value: 'pickup', label: 'Store pickup', disabled: true },\n  ]}\n/>",
  "cmp-switch": "<Switch defaultChecked label=\"New arrivals\" />\n<Switch label=\"Price alerts\" />\n<Switch disabled label=\"Locked\" />",
  "cmp-alert": "<Alert variant=\"info\" title=\"Delivery\">\n  Arriving Nov 20.\n</Alert>\n<Alert variant=\"success\" title=\"Added to cart\">\n  Side table added.\n</Alert>\n<Alert variant=\"warning\" title=\"Low stock\">Only 3 left.</Alert>\n<Alert variant=\"error\" title=\"Address missing\" onClose={() => {}}>\n  Add a shipping address.\n</Alert>",
  "cmp-skeleton": "<Skeleton circle width={44} height={44} />\n<SkeletonText lines={3} />\n\n{/* Skeleton also accepts width / height; shimmer animation on by default */}",
  "cmp-tooltip": "<Tooltip content=\"Tooltip on top\">\n  <Button size=\"sm\" variant=\"outline\">Top tooltip</Button>\n</Tooltip>\n<Tooltip content=\"Tooltip on bottom\" side=\"bottom\">\n  <Button size=\"sm\" variant=\"outline\">Bottom tooltip</Button>\n</Tooltip>",
  "cmp-progress": "<Progress value={64} label=\"Task progress\" showValue />\n<Progress value={30} size=\"sm\" />\n<Progress value={90} size=\"lg\" showValue />",
  "cmp-popover": "<Popover>\n  <PopoverTrigger>Delivery details</PopoverTrigger>\n  <PopoverContent title=\"Estimated delivery\">\n    Your order arrives Nov 20.\n    The courier will text you before dispatch.\n  </PopoverContent>\n</Popover>",
  "cmp-segmented": "<Segmented\n  defaultValue=\"week\"\n  options={[\n    { value: 'day', label: 'D' },\n    { value: 'week', label: 'W' },\n    { value: 'month', label: 'M' },\n    { value: 'year', label: 'Y', disabled: true },\n  ]}\n/>",
  "cmp-divider": "<Divider />\n<Divider label=\"or pick a room\" />\n<div>\n  <span>Living room</span><Divider orientation=\"vertical\" /><span>Bedroom</span>\n</div>",
  "cmp-statistic": "<Statistic\n  label=\"Orders\"\n  value=\"1,472\"\n  trend={{ value: 12.4 }}\n  hint=\"vs last month\"\n/>\n<Statistic label=\"Avg. order\" value=\"899\" prefix=\"¥\" />",
  "cmp-collapse": "<Collapse\n  defaultActive={['ship']}\n  items={[\n    { key: 'ship', title: 'Delivery & pickup', children: 'Free shipping over ¥199.' },\n    { key: 'return', title: 'Returns policy', children: 'Return or exchange within 365 days.' },\n    { key: 'pay', title: 'Payment methods', children: 'Alipay, WeChat Pay and cards accepted.' },\n  ]}\n/>",
  "cmp-pagination": "<Pagination\n  total={96}\n  pageSize={10}\n  defaultValue={4}\n  onValueChange={(page) => console.log(page)}\n/>",
  "cmp-masonry": "<Masonry\n  columns={{ xs: 1, sm: 2, md: 3 }}\n  gutter={12}\n  items={items}\n  itemRender={({ height }) => <div style={{ height }} />}\n  onLayoutChange={(layout) => console.log(layout)}\n/>"
}

function Demo({ id, title, note, code: codeProp, children }: { id?: string; title: string; note?: string; code?: string; children: React.ReactNode }) {
  const { t } = useI18n()
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const code = codeProp ?? (id ? CODES[id] : undefined)
  const copy = () => {
    if (!code) return
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => {})
  }
  return (
    <div id={id} style={{ display: 'block', scrollMarginTop: 80 }} className="fp-demo">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--fp-space-3)', marginBottom: 'var(--fp-space-4)' }}>
        <span style={{ fontSize: 'var(--fp-text-base)', fontWeight: 'var(--fp-weight-semibold)' }}>{title}</span>
        {note && <span className="fp-label">{note}</span>}
        {code && (
          <Button
            variant="link"
            size="sm"
            onClick={() => setShowCode(!showCode)}
            style={{ marginLeft: 'auto', gap: 'var(--fp-space-1)', color: showCode ? 'var(--fp-ink)' : 'var(--fp-muted)', fontSize: 'var(--fp-text-xs)', padding: 0, height: 'auto' }}
          >
            <Code2 size={16} /> {showCode ? t('cmp.hideCode') : t('cmp.viewCode')}
          </Button>
        )}
      </div>
      {children}
      {showCode && code && (
        <div style={{ marginTop: 'var(--fp-space-3)', overflow: 'hidden', background: 'var(--fp-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--fp-space-2) var(--fp-space-3) 0 var(--fp-space-4)' }}>
            <span style={{ fontFamily: 'var(--fp-mono)', fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>TSX</span>
            <Button variant="ghost" size="icon-sm" onClick={copy} title={t('cmp.copy')} style={{ color: 'var(--fp-muted)' }}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
          </div>
          <pre style={{ margin: 0, padding: 'var(--fp-space-3)', color: 'var(--fp-ink)', fontFamily: 'var(--fp-mono)', fontSize: 'var(--fp-text-xs)', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{code}</pre>
        </div>
      )}
    </div>
  )
}
export default function ComponentsPage() {
  const { t, lang } = useI18n()
  const [active, setActive] = useState('buttons')

  return (
    <div className="fp-comp-layout" style={{ display: 'flex', gap: 'var(--fp-space-6)', alignItems: 'flex-start' }}>
      <aside className="fp-comp-aside" style={{
        width: 200, flexShrink: 0, position: 'sticky', top: 112,
      }}>
        <div className="fp-label" style={{ padding: 'var(--fp-space-2) var(--fp-space-3) var(--fp-space-3)' }}>{t('cmp.sidebar')}</div>
        {sections.map((s) => (
          <SidebarItem
            key={s.id}
            active={active === s.id}
            icon={s.icon}
            onClick={() => {
              setActive(s.id)
              document.getElementById('cmp-' + s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            {s.label}
          </SidebarItem>
        ))}
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <Kicker>{t('cmp.kicker')}</Kicker>
        <h1 style={{ fontSize: 'var(--fp-text-2xl)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 'var(--fp-space-4) 0 var(--fp-space-3)' }}>
          {t('cmp.title')}
        </h1>
        <p style={{ fontSize: 'var(--fp-text-base)', color: 'var(--fp-muted)', maxWidth: 620, margin: '0 0 var(--fp-space-7)' }}>
          {t('cmp.intro')}
        </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))', gap: 'var(--fp-space-8) var(--fp-space-7)', marginTop: 'var(--fp-space-6)' }}>

            <Demo id="cmp-buttons" title="Button" note="5 variants / 4 sizes">
              <div style={{ display: 'flex', gap: 'var(--fp-space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button size="icon" aria-label="Search"><Search size={16} /></Button>
                <Button disabled>Disabled</Button>
              </div>
              <div data-demo="sizes" style={{ display: 'flex', gap: 'var(--fp-space-2)', flexWrap: 'wrap', alignItems: 'center', marginTop: 'var(--fp-space-4)' }}>
                <Button size="sm">Small 32</Button>
                <Button>Default 40</Button>
                <Button size="lg">Large 48</Button>
              </div>
            </Demo>

            <Demo id="cmp-badge" title="Badge" note="4 variants">
              <div style={{ display: 'flex', gap: 'var(--fp-space-2)', flexWrap: 'wrap' }}>
                <Badge>New</Badge><Badge variant="outline">On sale</Badge>
                <Badge variant="success">In stock</Badge><Badge variant="danger">Sold out</Badge>
              </div>
            </Demo>

            <Demo id="cmp-card" title="Card" note="one border">
              <Card>
                <CardHeader>
                  <div className="fp-label fp-num">304.492</div>
                  <CardTitle>Side table</CardTitle>
                  <CardDescription>Aluminium / 65 × 65 cm</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{
                    height: 110,
                    background: 'var(--fp-surface)',
                  }} />
                </CardContent>
                <CardFooter style={{ justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: 'var(--fp-text-base)',}}>¥ 499</strong>
                  <Button size="sm">Add to cart <ShoppingBag size={16} /></Button>
                </CardFooter>
              </Card>
            </Demo>

            <Demo id="cmp-input" title="Input" note="manual form">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-4)' }}>
                <div><Label>Room name</Label><Input placeholder="e.g. Living room" /></div>
                <div><Label>Dimensions (cm)</Label><Input placeholder="65 × 65" defaultValue="65 × 65" /></div>
              </div>
            </Demo>

            <Demo id="cmp-dialog" title="Dialog" note="portal + esc">
              <Dialog>
                <DialogTrigger>Open instructions</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <div className="fp-label">Step 03 / 08</div>
                    <DialogTitle>Confirm configuration</DialogTitle>
                    <DialogDescription>Use the included hex key. Turn the four bolts clockwise until snug.</DialogDescription>
                  </DialogHeader>
                  <div style={{
                    height: 130, background: 'var(--fp-surface)',
                  }} />
                  <DialogFooter>
                    <DialogClose>Back</DialogClose>
                    <DialogClose><Button size="sm">Next <Check size={16} /></Button></DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Demo>

            <Demo id="cmp-tabs" title="Tabs" note="three panels">
              <Tabs defaultValue="spec">
                <TabsList>
                  <TabsTrigger value="spec">Specs</TabsTrigger>
                  <TabsTrigger value="review">Reviews</TabsTrigger>
                  <TabsTrigger value="care">Care</TabsTrigger>
                </TabsList>
                <TabsContent value="spec">Solid wood frame with clear finish. 30 kg capacity.</TabsContent>
                <TabsContent value="review">"Ten minutes to assemble." — Verified buyer</TabsContent>
                <TabsContent value="care">Wipe with a clean soft cloth. Keep out of direct sunlight.</TabsContent>
              </Tabs>
            </Demo>

            <Demo id="cmp-sheet" title="Sheet" note="right drawer">
              <Sheet>
                <SheetTrigger>Cart (2)</SheetTrigger>
                <SheetContent title="Cart">
                  <div className="fp-label" style={{ marginBottom: 'var(--fp-space-3)' }}>2 items · 83.00</div>
                  {['Side table', 'Wool rug'].map((n) => (
                    <div key={n} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--fp-space-3) 0', borderBottom: '1px solid var(--fp-line)', fontSize: 'var(--fp-text-xs)' }}>
                      <span>{n}</span><strong>¥ 499</strong>
                    </div>
                  ))}
                  <div style={{ marginTop: 'var(--fp-space-5)' }}><Button style={{ width: '100%' }}>Checkout</Button></div>
                </SheetContent>
              </Sheet>
            </Demo>

            <Demo id="cmp-dropdown-menu" title="Dropdown" note="click outside closes">
              <DropdownMenu>
                <DropdownMenuTrigger>Categories</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Living room <span className="fp-label">01</span></DropdownMenuItem>
                  <DropdownMenuItem>Bedroom <span className="fp-label">02</span></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Office <span className="fp-label">03</span></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Demo>

            <Demo id="cmp-table" title="Table" note="manual data">
              <Table>
                <TableCaption>Item list</TableCaption>
                <TableHeader>
                  <TableRow><TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Status</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell>Monitor</TableCell><TableCell>1</TableCell><TableCell><Badge variant="outline">Done</Badge></TableCell></TableRow>
                  <TableRow><TableCell>Keyboard</TableCell><TableCell>4</TableCell><TableCell><Badge variant="default">In progress</Badge></TableCell></TableRow>
                  <TableRow><TableCell>Hex key</TableCell><TableCell>1</TableCell><TableCell><Badge variant="success">In stock</Badge></TableCell></TableRow>
                </TableBody>
              </Table>
            </Demo>

            <Demo id="cmp-breadcrumb" title="Breadcrumb" note="hierarchy">
              <Breadcrumb>
                <BreadcrumbItem><BreadcrumbLink>Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink>Bedroom</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbCurrent>Beds & mattresses</BreadcrumbCurrent></BreadcrumbItem>
              </Breadcrumb>
            </Demo>

            <Demo id="cmp-image" title="Image" note="4 ratios + fallback">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--fp-space-2)' }}>
                <Image ratio="square" alt="Square" />
                <Image ratio="4:3" alt="4:3" />
                <Image ratio="3:4" alt="3:4" />
              </div>
            </Demo>

            <Demo id="cmp-avatar" title="Avatar" note="3 sizes + initials">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)' }}>
                <Avatar size="sm" name="Li" />
                <Avatar size="md" name="Ming Wang" />
                <Avatar size="lg" name="Anna" />
                <span style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>Team members</span>
              </div>
            </Demo>

            <Demo id="cmp-empty" title="Empty" note="no results">
              <Empty
                title="No results found"
                description="Try another category or adjust your filters."
                action={<Button size="sm">Clear filters</Button>}
              />
            </Demo>

            <Demo id="cmp-steps" title="Steps" note="task flow">
              <Steps
                current={1}
                steps={[
                  { title: 'Create project', description: 'Enter project details' },
                  { title: 'Configure', description: 'Set core parameters with the hex key' },
                  { title: 'Publish', description: 'Align the pilot holes, then fasten' },
                  { title: 'Done', description: 'Put the side table in your favourite corner' },
                ]}
              />
            </Demo>

            <Demo id="cmp-select" title="Select" note="custom listbox">
              <div style={{ display: 'flex', gap: 'var(--fp-space-3)', flexWrap: 'wrap' }}>
                <Select
                  options={[
                    { value: 'living', label: 'Living room' },
                    { value: 'bedroom', label: 'Bedroom' },
                    { value: 'kitchen', label: 'Kitchen' },
                    { value: 'office', label: 'Office' },
                  ]}
                  defaultValue="living"
                />
                <Select options={[{ value: 'a', label: 'A' }]} placeholder="Select a room" />
              </div>
            </Demo>

            <Demo id="cmp-checkbox" title="Checkbox" note="controlled state">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--fp-space-4)' }}>
                <Checkbox defaultChecked label="Sofa" />
                <Checkbox label="Table" />
                <Checkbox indeterminate label="Rug" />
                <Checkbox disabled defaultChecked label="Archived" />
              </div>
            </Demo>

            <Demo id="cmp-radio" title="Radio" note="single choice">
              <RadioGroup
                defaultValue="standard"
                options={[
                  { value: 'standard', label: 'Standard (3–5 days)' },
                  { value: 'express', label: 'Express (next day)' },
                  { value: 'pickup', label: 'Store pickup', disabled: true },
                ]}
              />
            </Demo>

            <Demo id="cmp-switch" title="Switch" note="toggle">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--fp-space-5)' }}>
                <Switch defaultChecked label="New arrivals" />
                <Switch label="Price alerts" />
                <Switch disabled label="Locked" />
              </div>
            </Demo>

            <Demo id="cmp-alert" title="Alert" note="4 variants">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-3)' }}>
                <Alert variant="info" title="Delivery">Your order arrives Nov 20.</Alert>
                <Alert variant="success" title="Added to cart">Side table added.</Alert>
                <Alert variant="warning" title="Low stock">Only 3 left.</Alert>
                <Alert variant="error" title="Address missing" onClose={() => {}}>Add a shipping address to continue.</Alert>
              </div>
            </Demo>

            <Demo id="cmp-skeleton" title="Skeleton" note="loading shapes">
              <div style={{ display: 'flex', gap: 'var(--fp-space-4)', alignItems: 'flex-start' }}>
                <Skeleton circle width={44} height={44} />
                <div style={{ flex: 1 }}><SkeletonText lines={3} /></div>
              </div>
            </Demo>

            <Demo id="cmp-tooltip" title="Tooltip" note="hover / focus">
              <div style={{ display: 'flex', gap: 'var(--fp-space-5)' }}>
                <Tooltip content="Tooltip on top">
                  <Button size="sm" variant="outline">Top tooltip</Button>
                </Tooltip>
                <Tooltip content="Tooltip on bottom" side="bottom">
                  <Button size="sm" variant="outline">Bottom tooltip</Button>
                </Tooltip>
              </div>
            </Demo>

            <Demo id="cmp-progress" title="Progress" note="3 sizes">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-4)' }}>
                <Progress value={64} label="Task progress" showValue />
                <Progress value={30} size="sm" />
                <Progress value={90} size="lg" showValue />
              </div>
            </Demo>

            <Demo id="cmp-popover" title="Popover" note="click outside closes">
              <Popover>
                <PopoverTrigger>Delivery details</PopoverTrigger>
                <PopoverContent title="Estimated delivery">
                  Your order arrives Nov 20. The courier will text you before dispatch.
                </PopoverContent>
              </Popover>
            </Demo>

            <Demo id="cmp-segmented" title="Segmented" note="single choice">
              <Segmented
                defaultValue="week"
                options={[{ value: 'day', label: 'D' }, { value: 'week', label: 'W' }, { value: 'month', label: 'M' }, { value: 'year', label: 'Y', disabled: true }]}
              />
            </Demo>

            <Demo id="cmp-divider" title="Divider" note="horizontal / vertical">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-4)' }}>
                <Divider />
                <Divider label="or pick a room" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)', fontSize: 'var(--fp-text-xs)' }}>
                  <span>Living room</span><Divider orientation="vertical" /><span>Bedroom</span><Divider orientation="vertical" /><span>Kitchen</span>
                </div>
              </div>
            </Demo>

            <Demo id="cmp-statistic" title="Statistic" note="metric">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--fp-space-4)' }}>
                <Statistic label="Orders" value="1,472" trend={{ value: 12.4 }} hint="vs last month" />
                <Statistic label="Avg. order" value="899" prefix="¥" hint="this quarter" />
              </div>
            </Demo>

            <Demo id="cmp-collapse" title="Collapse" note="accordion">
              <Collapse defaultActive={['ship']} items={[
                { key: 'ship', title: 'Delivery & pickup', children: 'Free shipping over ¥199. You can also pick up at a nearby store.' },
                { key: 'return', title: 'Returns policy', children: 'Return or exchange within 365 days. Keep the receipt and original packaging.' },
                { key: 'pay', title: 'Payment methods', children: 'Alipay, WeChat Pay and bank cards accepted.' },
              ]} />
            </Demo>

            <Demo id="cmp-pagination" title="Pagination" note="with ellipsis">
              <Pagination total={96} pageSize={10} defaultValue={4} />
            </Demo>

            <Demo id="cmp-masonry" title="Masonry" note="shortest-column · responsive">
              <div style={{ width: '100%' }}>
                <Masonry
                  columns={{ xs: 1, sm: 2, md: 3 }}
                  gutter={10}
                  items={[96, 64, 132, 76, 108, 88, 120, 70].map((h, i) => ({ key: i, height: h }))}
                  itemRender={({ height }) => (
                    <div style={{ height, background: 'var(--fp-surface)', display: 'grid', placeItems: 'center', fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>{height}</div>
                  )}
                />
              </div>
            </Demo>

            {extraDocs.map((d) => (
              <Demo key={d.id} id={`cmp-${d.id}`} title={d.title} note={lang === 'zh' ? d.category : d.categoryEn} code={d.examples[0]?.code}>
                <div style={{ display: 'flex', justifyContent: 'center' }}><ExtraDemo id={d.id} /></div>
              </Demo>
            ))}
          </div>
      </main>
    </div>
  )
}
