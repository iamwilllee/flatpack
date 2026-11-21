// Live previews for the second-wave components. Used by the component docs
// pages and the components gallery. Copy is English, like every demo.
import { useState } from 'react'
import { ArrowUpRight, Search, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Link2, Heart, FilePlus, Moon, BookOpen, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RevealGroup } from '@/components/ui/reveal'
import { Input, Label } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Image } from '@/components/ui/image'
import { Textarea } from '@/components/ui/textarea'
import { Field, Fieldset, FieldControl } from '@/components/ui/field'
import { NumberInput } from '@/components/ui/number-input'
import { Slider } from '@/components/ui/slider'
import { Combobox } from '@/components/ui/combobox'
import { ToggleGroup, ButtonGroup } from '@/components/ui/toggle-group'
import { ChipGroup } from '@/components/ui/chip-group'
import { Toolbar, ToolbarGroup, ToolbarButton, ToolbarToggle, ToolbarSeparator, ToolbarSpacer } from '@/components/ui/toolbar'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/toast'
import { HoverCard } from '@/components/ui/hover-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CommandPalette } from '@/components/ui/command-palette'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Spinner } from '@/components/ui/spinner'
import { AvatarGroup } from '@/components/ui/avatar-group'
import { CodeBlock, Code } from '@/components/ui/code-block'
import { Calendar } from '@/components/ui/calendar'
import { DatePicker, DateRangePicker } from '@/components/ui/date-picker'
import { FileInput } from '@/components/ui/file-input'
import { MultiSelect } from '@/components/ui/multi-select'
import { Tree } from '@/components/ui/tree'
import { DescriptionList } from '@/components/ui/description-list'
import { ContextMenu } from '@/components/ui/context-menu'
import { Menubar } from '@/components/ui/menubar'
import { Carousel } from '@/components/ui/carousel'
import { LightboxGallery } from '@/components/ui/lightbox'
import { Timestamp } from '@/components/ui/timestamp'
import { StatusDot } from '@/components/ui/status-dot'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { PHOTOS } from '@/site/photos'
import { useTheme } from '@/site/theme'

const row: React.CSSProperties = { display: 'flex', gap: 'var(--fp-space-3)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }
const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-4)', width: '100%', maxWidth: 360 }

const cities = [
  { value: 'sh', label: 'Shanghai' }, { value: 'bj', label: 'Beijing' }, { value: 'sz', label: 'Shenzhen' },
  { value: 'hz', label: 'Hangzhou' }, { value: 'cd', label: 'Chengdu' }, { value: 'gz', label: 'Guangzhou' },
]
const rooms = [
  { value: 'living', label: 'Living room' }, { value: 'bedroom', label: 'Bedroom' }, { value: 'kitchen', label: 'Kitchen' },
  { value: 'study', label: 'Study' }, { value: 'bath', label: 'Bathroom' },
]
// About a day before page load.
const placedAt = new Date(Date.now() - 26 * 3600 * 1000)

function CommandDemo() {
  const [open, setOpen] = useState(false)
  const { toggle } = useTheme()
  const say = (title: string) => () => toast({ title })
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Search <KbdGroup keys={['⌘', 'K']} /></Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        hotkey={false}
        commands={[
          { id: 'new', group: 'Actions', label: 'New project', icon: <FilePlus size={16} />, shortcut: 'N', onSelect: say('New project') },
          { id: 'theme', group: 'Actions', label: 'Toggle theme', icon: <Moon size={16} />, onSelect: toggle },
          { id: 'docs', group: 'Go to', label: 'Docs', icon: <BookOpen size={16} />, onSelect: () => { window.location.hash = '/docs' } },
          { id: 'blocks', group: 'Go to', label: 'Blocks', icon: <LayoutGrid size={16} />, keywords: ['screens'], onSelect: () => { window.location.hash = '/blocks' } },
        ]}
      />
    </>
  )
}

function RevealDemo() {
  const [run, setRun] = useState(0)
  return (
    <div style={{ display: 'grid', gap: 'var(--fp-space-3)', justifyItems: 'start' }}>
      <RevealGroup key={run} style={{ display: 'grid', gap: 'var(--fp-space-2)' }}>
        <h3 data-reveal="enter" style={{ fontSize: 'var(--fp-text-xl)' }}>Write it down once.</h3>
        <p data-reveal="enter" data-reveal-step="1" style={{ color: 'var(--fp-muted)' }}>Find it every time.</p>
        <div data-reveal="enter" data-reveal-step="2"><Button>Try it</Button></div>
      </RevealGroup>
      <Button size="sm" variant="outline" onClick={() => setRun((n) => n + 1)}>Replay</Button>
    </div>
  )
}

function CalendarDemo() {
  const [date, setDate] = useState<Date | null>(new Date())
  return <Calendar value={date} onValueChange={setDate} />
}

export function ExtraDemo({ id, variant = 0 }: { id: string; variant?: number }) {
  switch (id) {
    case 'textarea':
      return <div style={col}><div><Label>Delivery notes</Label><Textarea placeholder="Leave it at the front desk" rows={4} /></div></div>
    case 'field':
      return (
        <div style={col}>
          <Fieldset legend="Shipping">
            <Field label="Name" required description="As on your ID."><FieldControl render={<Input />} /></Field>
            <Field label="Postcode" error="Enter a 6-digit postcode."><FieldControl render={<Input defaultValue="1000" />} /></Field>
          </Fieldset>
        </div>
      )
    case 'number-input':
      return <div style={row}><NumberInput defaultValue={2} min={1} max={10} aria-label="Quantity" /></div>
    case 'slider':
      return (
        <div style={col}>
          <Slider defaultValue={40} label="Seat height" showValue format={(v) => `${v} cm`} />
          <Slider defaultValue={[200, 800]} min={0} max={1000} step={50} label="Price" showValue format={(v) => `¥${v}`} />
        </div>
      )
    case 'combobox':
      return <div style={col}><Combobox placeholder="Search a city" options={cities} aria-label="City" /></div>
    case 'chip-group': {
      const cats = [
        { value: 'all', label: '全部作品', count: 11 },
        { value: 'dev', label: '开发与发布' },
        { value: 'tools', label: '效率工具' },
        { value: 'research', label: '研究与创作' },
        { value: 'family', label: '亲子与家庭' },
      ]
      if (variant === 1) return <ChipGroup multiple size="sm" defaultValue={['oak']} options={[{ value: 'oak', label: 'Oak' }, { value: 'pine', label: 'Pine' }, { value: 'walnut', label: 'Walnut' }]} />
      if (variant === 2) return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-5)', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="outline" size="sm">GitHub <ArrowUpRight size={16} /></Button></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--fp-space-4)' }}>
            <ChipGroup size="sm" defaultValue="all" options={cats} aria-label="Category" />
            <Input size="sm" variant="filled" leading={<Search size={16} />} placeholder="找一个项目" style={{ width: 240 }} />
          </div>
        </div>
      )
      return <ChipGroup defaultValue="all" options={cats} aria-label="Category" />
    }
    case 'toggle-group':
      return (
        <div style={{ ...row, flexDirection: 'column' }}>
          <ToggleGroup defaultValue={['left']} options={[
            { value: 'left', label: <AlignLeft size={16} />, 'aria-label': 'Left' },
            { value: 'center', label: <AlignCenter size={16} />, 'aria-label': 'Center' },
            { value: 'right', label: <AlignRight size={16} />, 'aria-label': 'Right' },
          ]} />
          <ToggleGroup multiple defaultValue={['b']} options={[{ value: 'b', label: 'B' }, { value: 'i', label: 'I' }, { value: 'u', label: 'U' }]} />
          <ButtonGroup><Button variant="outline">Day</Button><Button variant="outline">Week</Button><Button variant="outline">Month</Button></ButtonGroup>
        </div>
      )
    case 'toolbar':
      return (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Toolbar aria-label="Formatting">
            <ToolbarGroup>
              <ToolbarToggle aria-label="Bold" defaultPressed><Bold size={16} /></ToolbarToggle>
              <ToolbarToggle aria-label="Italic"><Italic size={16} /></ToolbarToggle>
              <ToolbarToggle aria-label="Underline"><Underline size={16} /></ToolbarToggle>
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarButton aria-label="Link"><Link2 size={16} /></ToolbarButton>
            <ToolbarSpacer />
            <ToolbarButton>Share</ToolbarButton>
          </Toolbar>
          <p style={{ padding: 'var(--fp-space-3) var(--fp-space-2)', fontSize: 'var(--fp-text-sm)', color: 'var(--fp-muted)' }}>Assembly takes about ten minutes.</p>
        </div>
      )
    case 'alert-dialog':
      return (
        <AlertDialog
          trigger={<Button variant="outline">Delete project</Button>}
          title="Delete this project?"
          description="Its 12 pages and all comments go with it. This cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Keep"
          danger
          onConfirm={() => toast({ title: 'Project deleted' })}
        />
      )
    case 'toast':
      return (
        <div style={row}>
          <Button variant="outline" onClick={() => toast({ title: 'Added to cart', description: 'Side table × 1' })}>Default</Button>
          <Button variant="outline" onClick={() => toast({ title: 'Order placed', type: 'success' })}>Success</Button>
          <Button variant="outline" onClick={() => toast({ title: 'Payment failed', description: 'Try another card.', type: 'error' })}>Error</Button>
        </div>
      )
    case 'hover-card':
      return (
        <p style={{ fontSize: 'var(--fp-text-sm)' }}>
          Assembled by{' '}
          <HoverCard trigger="Alex Wang" href="#/docs/components/hover-card">
            <div style={{ display: 'flex', gap: 'var(--fp-space-3)', alignItems: 'center' }}>
              <Avatar name="Alex Wang" src={PHOTOS.face3} />
              <div><strong>Alex Wang</strong><div className="fp-muted" style={{ fontSize: 'var(--fp-text-xs)' }}>Product designer · 42 reviews</div></div>
            </div>
          </HoverCard>.
        </p>
      )
    case 'scroll-area':
      return (
        <div style={{ width: '100%', maxWidth: 320, borderTop: '1px solid var(--fp-line)', borderBottom: '1px solid var(--fp-line)' }}>
          <ScrollArea style={{ height: 180 }}>
            {Array.from({ length: 16 }, (_, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--fp-space-2) var(--fp-space-3)', fontSize: 'var(--fp-text-sm)' }}>
                <span>Order</span><span className="fp-num">#{1042 - i}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
      )
    case 'command-palette':
      return <CommandDemo />
    case 'kbd':
      return (
        <div style={{ ...col, fontSize: 'var(--fp-text-sm)', maxWidth: 240 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Search</span><KbdGroup keys={['⌘', 'K']} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>New line</span><KbdGroup keys={['Shift', 'Enter']} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Close</span><Kbd>Esc</Kbd></div>
        </div>
      )
    case 'reveal':
      return <RevealDemo />
    case 'spinner':
      return <div style={row}><Spinner /><Spinner size="lg" /><Button disabled><Spinner /> Saving</Button></div>
    case 'avatar-group':
      return <AvatarGroup max={4} people={[{ name: 'Alex Wang', src: PHOTOS.face1 }, { name: 'Lea Li', src: PHOTOS.face2 }, { name: 'Ming Zhao', src: PHOTOS.face3 }, { name: 'Anna Chen', src: PHOTOS.face4 }, { name: 'Tom Xu' }, { name: 'Yu Sun' }]} />
    case 'code-block':
      return (
        <div style={{ ...col, maxWidth: 480 }}>
          <CodeBlock label="Terminal" code="npm run build:tokens -- --preset fp1-c-i-s-15-6-2-n" />
          <p style={{ fontSize: 'var(--fp-text-sm)' }}>Run <Code>npm run dev</Code> to start.</p>
        </div>
      )
    case 'calendar':
      return <CalendarDemo />
    case 'date-picker':
      return <div style={col}><DatePicker placeholder="Delivery date" min={new Date()} /><DateRangePicker placeholder="Stay" /></div>
    case 'file-input':
      return (
        <div style={{ ...col, maxWidth: 420 }}>
          <FileInput multiple accept="image/*" maxSize={5 * 1024 * 1024} hint="PNG or JPG, up to 5 MB"
            onReject={(files) => toast({ title: `${files[0].name} is too large`, type: 'error' })} />
        </div>
      )
    case 'multi-select':
      return <div style={col}><MultiSelect placeholder="Add rooms" defaultValue={['living', 'study']} options={rooms} aria-label="Rooms" /></div>
    case 'tree':
      return (
        <div style={{ width: '100%', maxWidth: 280 }}>
          <Tree aria-label="Files" defaultExpanded={['src', 'ui']} defaultSelected="button" nodes={[
            { id: 'src', label: 'src', children: [
              { id: 'ui', label: 'components/ui', children: [{ id: 'button', label: 'button.tsx' }, { id: 'card', label: 'card.tsx' }] },
              { id: 'css', label: 'flatpack.css' },
            ] },
            { id: 'tokens', label: 'tokens', children: [{ id: 'json', label: 'flatpack.tokens.json' }] },
          ]} />
        </div>
      )
    case 'description-list':
      return (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <DescriptionList items={[
            { term: 'Order', value: <span className="fp-num">#1042</span> },
            { term: 'Status', value: <StatusDot status="success">Delivered</StatusDot> },
            { term: 'Placed', value: <Timestamp date={placedAt} format="datetime" /> },
            { term: 'Address', value: '88 Century Ave, Shanghai' },
          ]} />
        </div>
      )
    case 'context-menu':
      return (
        <div style={{ width: '100%', maxWidth: 360 }}>
          <ContextMenu entries={[
            { label: 'Open', shortcut: '↵' },
            { label: 'Rename', shortcut: 'F2' },
            { label: 'Duplicate', shortcut: '⌘D' },
            { type: 'separator' },
            { label: 'Delete', shortcut: '⌫', danger: true, onSelect: () => toast({ title: 'Deleted' }) },
          ]}>Right-click this area</ContextMenu>
        </div>
      )
    case 'menubar':
      return (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Menubar menus={[
            { label: 'File', entries: [{ label: 'New', shortcut: '⌘N' }, { label: 'Open…', shortcut: '⌘O' }, { type: 'separator' }, { label: 'Export' }] },
            { label: 'Edit', entries: [{ label: 'Undo', shortcut: '⌘Z' }, { label: 'Redo', shortcut: '⇧⌘Z' }] },
            { label: 'View', entries: [{ label: 'Zoom in', shortcut: '⌘+' }, { label: 'Zoom out', shortcut: '⌘−' }] },
          ]} />
        </div>
      )
    case 'carousel':
      return (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Carousel aria-label="Armchair photos" slides={[PHOTOS.armchair, PHOTOS.loungeChair, PHOTOS.chair].map((src) => <Image key={src} src={src} ratio="4:3" alt="Armchair" />)} />
        </div>
      )
    case 'lightbox':
      return (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <LightboxGallery images={[
            { src: PHOTOS.livingRoom, alt: 'Living room' }, { src: PHOTOS.bedroom, alt: 'Bedroom' }, { src: PHOTOS.office, alt: 'Office' },
          ]} />
        </div>
      )
    case 'timestamp':
      return (
        <div style={{ ...col, maxWidth: 240 }}>
          <Timestamp date={Date.now() - 3 * 60 * 1000} locale="en" />
          <Timestamp date={Date.now() - 2 * 86400 * 1000} locale="zh-CN" />
          <Timestamp date="2026-11-20T09:30:00" format="datetime" locale="en" />
        </div>
      )
    case 'status-dot':
      return <div style={row}><StatusDot>Running</StatusDot><StatusDot status="success">Delivered</StatusDot><StatusDot status="danger">Failed</StatusDot><StatusDot status="idle">Paused</StatusDot></div>
    case 'visually-hidden':
      return <Button size="icon" variant="outline"><Heart size={16} /><VisuallyHidden>Add to favourites</VisuallyHidden></Button>
    default:
      return null
  }
}

/** Ids handled here, in gallery order. */
export const EXTRA_IDS = [
  'textarea', 'field', 'number-input', 'slider', 'combobox', 'multi-select', 'date-picker', 'calendar', 'file-input',
  'chip-group', 'toggle-group', 'toolbar', 'alert-dialog', 'toast', 'hover-card', 'command-palette', 'context-menu', 'menubar',
  'scroll-area', 'tree', 'description-list', 'carousel', 'lightbox', 'avatar-group', 'status-dot', 'timestamp',
  'kbd', 'spinner', 'reveal', 'code-block', 'visually-hidden',
]
