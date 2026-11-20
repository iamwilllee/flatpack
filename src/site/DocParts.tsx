import { Check, Copy, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input, Label } from '@/components/ui/input'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table'
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
import { Kbd } from '@/components/ui/kbd'
import { BorderBeam } from '@/components/ui/border-beam'
import { Masonry } from '@/components/ui/masonry'
import { ExtraDemo } from '@/site/DocDemosExtra'

export function CodeBlock({ code, copied, onCopy, label = 'TSX' }: { code: string; copied: boolean; onCopy: () => void; label?: string }) {
  return (
    <div style={{ background: 'var(--fp-surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--fp-space-2) var(--fp-space-3) 0 var(--fp-space-4)' }}>
        <span style={{ fontFamily: 'var(--fp-mono)', fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)',}}>{label}</span>
        <Button variant="ghost" size="icon-sm" onClick={onCopy} title="Copy" style={{ color: 'var(--fp-muted)' }}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </Button>
      </div>
      <pre style={{ margin: 0, padding: 'var(--fp-space-3) var(--fp-space-4) var(--fp-space-4)', color: 'var(--fp-ink)', fontFamily: 'var(--fp-mono)', fontSize: 'var(--fp-text-sm)', overflowX: 'auto' }}>{code}</pre>
    </div>
  )
}

const wrap: React.CSSProperties = { display: 'flex', gap: 'var(--fp-space-2)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }

export function InlineDemo({ id, variant }: { id: string; variant: number }) {
  switch (id) {
    case 'button':
      return variant === 1
        ? <div data-demo="sizes" style={wrap}><Button size="sm">Small</Button><Button>Default</Button><Button size="lg">Large</Button><Button size="icon" aria-label="Search"><Search size={16} /></Button></div>
        : variant === 2
        ? <Button disabled>Disabled</Button>
        : <div style={wrap}><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="link">Link</Button></div>
    case 'card':
      return (
        <Card style={{ width: 300 }}>
          <CardHeader><CardTitle>Minimal side table</CardTitle><CardDescription>Aluminum / 65 × 65 cm</CardDescription></CardHeader>
          <CardContent><div style={{ height: 60, background: 'var(--fp-surface)', }} /></CardContent>
          <CardFooter><strong style={{ fontSize: 'var(--fp-text-base)' }}>¥ 499</strong><Button size="sm">Add to cart</Button></CardFooter>
        </Card>
      )
    case 'badge':
      return <div style={wrap}><Badge>New</Badge><Badge variant="outline">For sale</Badge><Badge variant="success">In stock</Badge><Badge variant="danger">Sold out</Badge></div>
    case 'input':
      if (variant === 1) return <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-3)', width: 280 }}><Input variant="filled" leading={<Search size={16} />} placeholder="找一个项目" /><Input leading={<Search size={16} />} trailing={<Kbd>⌘K</Kbd>} placeholder="Search docs" /></div>
      return <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-3)', width: 280 }}><div><Label>Room name</Label><Input placeholder="e.g. Living room" /></div><div><Label>Dimensions (cm)</Label><Input defaultValue="65 × 65" /></div></div>
    case 'dialog':
      return <Dialog><DialogTrigger>Open instructions</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Confirm configuration</DialogTitle><DialogDescription>Review each setting before continuing.</DialogDescription></DialogHeader><DialogFooter><DialogClose>Back</DialogClose><DialogClose><Button size="sm">Next</Button></DialogClose></DialogFooter></DialogContent></Dialog>
    case 'tabs':
      return <div style={{ width: '100%', maxWidth: 360 }}><Tabs defaultValue="spec"><TabsList><TabsTrigger value="spec">Specs</TabsTrigger><TabsTrigger value="review">Reviews</TabsTrigger><TabsTrigger value="care">Care</TabsTrigger></TabsList><TabsContent value="spec">Solid pine frame, holds up to 30 kg.</TabsContent><TabsContent value="review">Takes ten minutes to assemble.</TabsContent><TabsContent value="care">Wipe with a soft cloth.</TabsContent></Tabs></div>
    case 'sheet':
      return <Sheet><SheetTrigger>Cart (2)</SheetTrigger><SheetContent title="Cart"><div style={{ padding: 'var(--fp-space-3) 0', fontSize: 'var(--fp-text-xs)' }}>Minimal side table · ¥ 499</div><Button style={{ width: '100%' }}>Checkout</Button></SheetContent></Sheet>
    case 'dropdown':
      return <DropdownMenu><DropdownMenuTrigger>Category</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Living room</DropdownMenuItem><DropdownMenuItem>Bedroom</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem>Office and study</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
    case 'table':
      return <div style={{ width: '100%', maxWidth: 420 }}><Table><TableCaption>Item list</TableCaption><TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Monitor</TableCell><TableCell>1</TableCell><TableCell><Badge variant="outline">Done</Badge></TableCell></TableRow><TableRow><TableCell>Keyboard</TableCell><TableCell>4</TableCell><TableCell><Badge>In progress</Badge></TableCell></TableRow></TableBody></Table></div>
    case 'breadcrumb':
      return <Breadcrumb><BreadcrumbItem><BreadcrumbLink>Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink>Bedroom</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbCurrent>Beds and mattresses</BreadcrumbCurrent></BreadcrumbItem></Breadcrumb>
    case 'image':
      return variant === 1
        ? <div style={{ width: 200 }}><Image ratio="4:3" alt="No image yet" /></div>
        : <div style={{ display: 'flex', gap: 'var(--fp-space-2)' }}><div style={{ width: 80 }}><Image ratio="square" alt="Square" /></div><div style={{ width: 80 }}><Image ratio="4:3" alt="Four by three" /></div><div style={{ width: 60 }}><Image ratio="3:4" alt="Portrait" /></div></div>
    case 'avatar':
      return <div style={wrap}><Avatar size="sm" name="Ann" /><Avatar size="md" name="Alex Wang" /><Avatar size="lg" name="Anna" /></div>
    case 'empty':
      return <Empty title="No matching results" description="Try another category." action={<Button size="sm">Clear filters</Button>} />
    case 'steps':
      return <Steps current={1} steps={[{ title: 'Create project', description: 'Enter the basic project details' }, { title: 'Configure', description: 'Set the core parameters' }, { title: 'Go live' }, { title: 'Done' }]} />
    case 'select':
      return variant === 1
        ? <Select options={[{ value: 'a', label: 'A' }]} placeholder="Select a room" />
        : <Select options={[{ value: 'living', label: 'Living room' }, { value: 'bedroom', label: 'Bedroom' }, { value: 'kitchen', label: 'Kitchen' }]} defaultValue="living" />
    case 'checkbox':
      return <div style={{ display: 'flex', gap: 'var(--fp-space-4)', flexWrap: 'wrap' }}><Checkbox defaultChecked label="Sofa" /><Checkbox label="Coffee table" /><Checkbox indeterminate label="Rug" /><Checkbox disabled defaultChecked label="Discontinued" /></div>
    case 'radio':
      return <RadioGroup defaultValue="standard" options={[{ value: 'standard', label: 'Standard delivery (3-5 days)' }, { value: 'express', label: 'Express delivery (next day)' }, { value: 'pickup', label: 'Store pickup', disabled: true }]} />
    case 'switch':
      return <div style={wrap}><Switch defaultChecked label="New product alerts" /><Switch label="Price alerts" /><Switch disabled label="Locked" /></div>
    case 'alert':
      return <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-2)', width: '100%', maxWidth: 420 }}><Alert variant="info" title="Delivery">Estimated delivery on the 20th.</Alert><Alert variant="success" title="Added to cart">Your side table has been added.</Alert><Alert variant="warning" title="Low stock">Only 3 left.</Alert><Alert variant="error" title="Address missing" onClose={() => {}}>Please add a shipping address.</Alert></div>
    case 'skeleton':
      return <div style={{ display: 'flex', gap: 'var(--fp-space-4)', alignItems: 'flex-start', width: '100%', maxWidth: 320 }}><Skeleton circle width={44} height={44} /><div style={{ flex: 1 }}><SkeletonText lines={3} /></div></div>
    case 'tooltip':
      return <div style={wrap}><Tooltip content="Tooltip on top"><Button size="sm" variant="outline">Top tooltip</Button></Tooltip><Tooltip content="Tooltip on bottom" side="bottom"><Button size="sm" variant="outline">Bottom tooltip</Button></Tooltip></div>
    case 'progress':
      return <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-4)', width: '100%', maxWidth: 320 }}><Progress value={64} label="Task progress" showValue /><Progress value={30} size="sm" /><Progress value={90} size="lg" showValue /></div>
    case 'popover':
      return <Popover><PopoverTrigger>Delivery details</PopoverTrigger><PopoverContent title="Estimated delivery">Your order arrives on Nov 20, and we will text you before dispatch.</PopoverContent></Popover>
    case 'segmented':
      return <Segmented defaultValue="week" options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }, { value: 'year', label: 'Year', disabled: true }]} />
    case 'divider':
      return <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-3)', width: '100%', maxWidth: 320 }}><Divider /><Divider label="Or pick a room" /><div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)', fontSize: 'var(--fp-text-xs)' }}><span>Living room</span><Divider orientation="vertical" /><span>Bedroom</span><Divider orientation="vertical" /><span>Kitchen</span></div></div>
    case 'statistic':
      return <div style={{ display: 'flex', gap: 'var(--fp-space-6)' }}><Statistic label="Orders" value="1,472" trend={{ value: 12.4 }} hint="vs last month" /><Statistic label="Avg. order" value="899" prefix="¥" hint="this quarter" /></div>
    case 'collapse':
      return <Collapse defaultActive={['ship']} items={[{ key: 'ship', title: 'Shipping and pickup', children: 'Free shipping over ¥199, or pick up in store.' }, { key: 'return', title: 'Returns and exchanges', children: 'Return or exchange within 365 days.' }, { key: 'pay', title: 'Payment methods', children: 'We accept Alipay and WeChat Pay.' }]} />
    case 'pagination':
      return <Pagination total={96} pageSize={10} defaultValue={4} />
    case 'border-beam':
      return variant === 1
        ? <div style={{ width: 300 }}><BorderBeam duration={3} lineWidth={2} size={140}><Card style={{ padding: 'var(--fp-space-4)' }}><div style={{ fontSize: 'var(--fp-text-sm)', fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-1)' }}>Faster, thicker</div><div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>duration 3s · 2px</div></Card></BorderBeam></div>
        : <div style={{ width: 300 }}><BorderBeam><Card style={{ padding: 'var(--fp-space-4)' }}><div style={{ fontSize: 'var(--fp-text-sm)', fontWeight: 'var(--fp-weight-semibold)', marginBottom: 'var(--fp-space-1)' }}>Workspace overview</div><div style={{ fontSize: 'var(--fp-text-xs)', color: 'var(--fp-muted)' }}>Deliveries, invoices and returns in one panel.</div></Card></BorderBeam></div>
    case 'masonry': {
      const hs = [96, 64, 132, 76, 108, 88, 120, 70]
      return (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Masonry
            columns={variant === 1 ? { xs: 1, sm: 2, md: 3 } : 3}
            gutter={10}
            items={hs.map((h, i) => ({ key: i, height: h }))}
            itemRender={({ height }) => (
              <div style={{ height, background: 'var(--fp-surface)' }} />
            )}
          />
        </div>
      )
    }
    default:
      return <ExtraDemo id={id} variant={variant} />
  }
}