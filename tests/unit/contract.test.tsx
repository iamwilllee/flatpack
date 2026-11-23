// The contract every form control and overlay keeps: controlled and uncontrolled use, and
// props (id, name, aria-*, className, ref) reaching the DOM. Guards the Base UI upgrade path.
import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { RadioGroup } from '@/components/ui/radio'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectRoot, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Collapse } from '@/components/ui/collapse'
import { Pagination } from '@/components/ui/pagination'
import { Segmented } from '@/components/ui/segmented'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Alert } from '@/components/ui/alert'
import { Button, buttonProps } from '@/components/ui/button'
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { ToastProvider, useToast } from '@/components/ui/toast'
import { Tree } from '@/components/ui/tree'
import { Carousel } from '@/components/ui/carousel'
import { Calendar } from '@/components/ui/calendar'
import { DatePicker } from '@/components/ui/date-picker'
import { FileInput } from '@/components/ui/file-input'
import { CommandPalette } from '@/components/ui/command-palette'
import { ContextMenu } from '@/components/ui/context-menu'
import { Menubar } from '@/components/ui/menubar'
import { Lightbox } from '@/components/ui/lightbox'
import { Empty } from '@/components/ui/empty'
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from '@/components/ui/drawer'
import { OtpField } from '@/components/ui/otp-field'
import { Meter } from '@/components/ui/meter'
import { Form } from '@/components/ui/form'
import { Field, FieldControl } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from '@/components/ui/input-group'
import { Composer } from '@/components/ui/composer'

describe('Checkbox', () => {
  it('is controlled by `checked` and reports changes', async () => {
    const onChange = vi.fn()
    const { rerender } = render(<Checkbox label="Terms" checked={false} onCheckedChange={onChange} />)
    const box = screen.getByRole('checkbox', { name: 'Terms' })
    await userEvent.click(box)
    expect(onChange).toHaveBeenCalledWith(true, expect.anything())
    expect(box).toHaveAttribute('aria-checked', 'false') // controlled: the parent decides
    rerender(<Checkbox label="Terms" checked onCheckedChange={onChange} />)
    expect(screen.getByRole('checkbox', { name: 'Terms' })).toHaveAttribute('aria-checked', 'true')
  })
  it('passes id, name, value and required to the form control', () => {
    const { container } = render(
      <form>
        <Checkbox label="A" id="a" name="agree" value="yes" required defaultChecked />
      </form>,
    )
    expect(container.querySelector('#a')).toBeTruthy()
    const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement
    expect(input.name).toBe('agree')
    expect(input.required).toBe(true)
  })
})

describe('Checkbox and Switch without a label prop', () => {
  it('are named by an enclosing <label> instead of an empty wrapper', () => {
    render(
      <>
        <label>
          <Checkbox />
          Include this
        </label>
        <label>
          <Switch />
          Show details
        </label>
      </>,
    )
    expect(screen.getByRole('checkbox', { name: 'Include this' })).toBeInTheDocument()
    expect(screen.getByRole('switch', { name: 'Show details' })).toBeInTheDocument()
  })
})

describe('Switch', () => {
  it('toggles uncontrolled and passes name', async () => {
    const { container } = render(<Switch label="Alerts" name="alerts" />)
    const sw = screen.getByRole('switch', { name: 'Alerts' })
    expect(sw).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'true')
    expect(container.querySelector('input[name="alerts"]')).toBeTruthy()
  })
})

describe('RadioGroup', () => {
  const options = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
  ]
  it('is controlled', async () => {
    const onChange = vi.fn()
    render(<RadioGroup options={options} value="a" onValueChange={onChange} aria-label="Letters" />)
    expect(screen.getByRole('radiogroup', { name: 'Letters' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('radio', { name: 'Beta' }))
    expect(onChange).toHaveBeenCalledWith('b')
    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveAttribute('aria-checked', 'true')
  })
})

describe('Tabs', () => {
  it('follows a controlled value', async () => {
    const onChange = vi.fn()
    function Harness() {
      const [v, setV] = React.useState('one')
      return (
        <Tabs
          value={v}
          onValueChange={(next) => {
            onChange(next)
            setV(next as string)
          }}
        >
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">First</TabsContent>
          <TabsContent value="two">Second</TabsContent>
        </Tabs>
      )
    }
    render(<Harness />)
    await userEvent.click(screen.getByRole('tab', { name: 'Two' }))
    expect(onChange).toHaveBeenCalledWith('two')
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Second')).toBeVisible()
  })
})

describe('Select', () => {
  it('options form: controlled value, name and aria-label', async () => {
    const onChange = vi.fn()
    const { container } = render(
      <Select
        aria-label="Status"
        name="status"
        value="a"
        onValueChange={onChange}
        options={[
          { value: 'a', label: 'Open' },
          { value: 'b', label: 'Closed' },
        ]}
      />,
    )
    const trigger = screen.getByRole('combobox', { name: 'Status' })
    expect(trigger).toHaveTextContent('Open')
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole('option', { name: 'Closed' }))
    expect(onChange).toHaveBeenCalledWith('b')
    expect(container.querySelector('input[name="status"]')).toBeTruthy()
  })
  it('compound form: Base UI props reach the trigger', () => {
    render(
      <SelectRoot defaultValue="x" items={[{ value: 'x', label: 'Ex' }]}>
        <SelectTrigger id="pick" aria-label="Pick" size="default">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="x">Ex</SelectItem>
        </SelectContent>
      </SelectRoot>,
    )
    const trigger = screen.getByRole('combobox', { name: 'Pick' })
    expect(trigger).toHaveAttribute('id', 'pick')
    expect(trigger).toHaveAttribute('data-size', 'md') // `default` is an alias of md
  })
})

describe('Dialog', () => {
  it('opens and closes under parent control', async () => {
    const onOpenChange = vi.fn()
    function Harness() {
      const [open, setOpen] = React.useState(false)
      return (
        <Dialog
          open={open}
          onOpenChange={(o) => {
            onOpenChange(o)
            setOpen(o)
          }}
        >
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent showCloseButton closeLabel="Dismiss" className="wide">
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Body</DialogDescription>
            <DialogClose>Done</DialogClose>
          </DialogContent>
        </Dialog>
      )
    }
    render(<Harness />)
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    const dialog = await screen.findByRole('dialog', { name: 'Title' })
    expect(dialog).toHaveClass('wide')
    expect(within(dialog).getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
    await userEvent.click(within(dialog).getByRole('button', { name: 'Done' }))
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(screen.queryByRole('dialog')).toBeNull()
  })
  it('DialogTrigger render keeps your own element', async () => {
    render(
      <Dialog>
        <DialogTrigger render={<Button variant="destructive">Remove</Button>} />
        <DialogContent>
          <DialogTitle>T</DialogTitle>
        </DialogContent>
      </Dialog>,
    )
    const trigger = screen.getByRole('button', { name: 'Remove' })
    expect(trigger).toHaveAttribute('data-variant', 'destructive')
    await userEvent.click(trigger)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })
})

describe('DropdownMenu', () => {
  it('opens, selects and calls onSelect', async () => {
    const onSelect = vi.fn()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Actions">Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect} destructive>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }))
    const item = await screen.findByRole('menuitem', { name: 'Delete' })
    expect(item).toHaveAttribute('data-destructive')
    await userEvent.click(item)
    expect(onSelect).toHaveBeenCalledOnce()
  })
})

describe('Collapse, Pagination, Segmented', () => {
  it('Collapse follows `active`', async () => {
    const onActiveChange = vi.fn()
    render(<Collapse active={[]} onActiveChange={onActiveChange} items={[{ key: 'a', title: 'First', children: 'Body' }]} />)
    await userEvent.click(screen.getByRole('button', { name: 'First' }))
    expect(onActiveChange).toHaveBeenCalledWith(['a'])
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'false')
  })
  it('Pagination is controlled and its labels are localizable', async () => {
    const onChange = vi.fn()
    render(<Pagination total={50} pageSize={10} value={2} onValueChange={onChange} label="Seiten" nextLabel="Weiter" previousLabel="Zurück" />)
    expect(screen.getByRole('navigation', { name: 'Seiten' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Weiter' }))
    expect(onChange).toHaveBeenCalledWith(3)
  })
  it('Segmented takes aria-label and is controlled', async () => {
    const onChange = vi.fn()
    render(
      <Segmented
        aria-label="View"
        value="a"
        onValueChange={onChange}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
      />,
    )
    expect(screen.getByRole('tablist', { name: 'View' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(onChange).toHaveBeenCalledWith('b')
  })
})

describe('presentational components pass props through', () => {
  it('Progress keeps an accessible name', () => {
    render(<Progress value={30} aria-label="Upload" />)
    expect(screen.getByRole('progressbar', { name: 'Upload' })).toBeInTheDocument()
  })
  it('Input accepts the default size alias and ref', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} size="default" aria-label="Name" className="w-full" />)
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Name' }))
    expect(ref.current).toHaveAttribute('data-size', 'md')
    expect(ref.current).toHaveClass('w-full')
  })
  it('Alert forwards native props and localizes the close label', async () => {
    const onClose = vi.fn()
    render(
      <Alert data-testid="alert" id="a1" onClose={onClose} closeLabel="Schließen">
        Hi
      </Alert>,
    )
    expect(screen.getByTestId('alert')).toHaveAttribute('id', 'a1')
    await userEvent.click(screen.getByRole('button', { name: 'Schließen' }))
    expect(onClose).toHaveBeenCalled()
  })
  it('buttonProps turns a link into a button', () => {
    render(
      <a href="/x" {...buttonProps({ variant: 'outline', size: 'lg' })}>
        Go
      </a>,
    )
    const link = screen.getByRole('link', { name: 'Go' })
    expect(link).toHaveAttribute('data-slot', 'button')
    expect(link).toHaveAttribute('data-variant', 'outline')
    expect(link).toHaveAttribute('data-size', 'lg')
  })
})

describe('Tooltip (compound)', () => {
  it('describes its trigger and opens under parent control', () => {
    render(
      <TooltipProvider>
        <TooltipRoot defaultOpen>
          <TooltipTrigger render={<button type="button" aria-label="Filters" />}>F</TooltipTrigger>
          <TooltipContent>Filter the list</TooltipContent>
        </TooltipRoot>
      </TooltipProvider>,
    )
    const tip = screen.getByRole('tooltip')
    expect(tip).toHaveTextContent('Filter the list')
    expect(screen.getByRole('button', { name: 'Filters' })).toHaveAttribute('aria-describedby', tip.id)
  })
})

describe('ToastProvider and useToast', () => {
  it('shows a request-local toast with localized labels', async () => {
    function Trigger() {
      const toast = useToast()
      return <button onClick={() => toast.add({ title: 'Saved', description: 'All good', type: 'success' })}>Go</button>
    }
    render(
      <ToastProvider dismissLabel="Schließen" regionLabel="Hinweise">
        <Trigger />
      </ToastProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(await screen.findByText('Saved')).toBeInTheDocument()
    expect(screen.getByText('All good')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Schließen' })).toBeInTheDocument()
    expect(screen.getByLabelText('Hinweise')).toBeInTheDocument()
  })
})

describe('Tree, Carousel, Calendar', () => {
  const nodes = [{ id: 'src', label: 'src', children: [{ id: 'a', label: 'a.ts' }] }]
  it('Tree follows `expanded` and reports changes', async () => {
    const onExpandedChange = vi.fn()
    render(<Tree aria-label="Files" nodes={nodes} expanded={[]} onExpandedChange={onExpandedChange} />)
    await userEvent.click(screen.getByRole('treeitem', { name: 'src' }))
    expect(onExpandedChange).toHaveBeenCalledWith(['src'])
    expect(screen.queryByRole('treeitem', { name: 'a.ts' })).toBeNull() // controlled: the parent decides
  })
  it('Carousel reports index changes and takes localized labels', async () => {
    const onIndexChange = vi.fn()
    render(<Carousel aria-label="Photos" previousLabel="Zurück" nextLabel="Weiter" slideLabel={(i, n) => `Bild ${i} von ${n}`} onIndexChange={onIndexChange} slides={['a', 'b', 'c']} />)
    await userEvent.click(screen.getByRole('button', { name: 'Weiter' }))
    expect(onIndexChange).toHaveBeenCalledWith(1)
    expect(screen.getByRole('group', { name: 'Bild 2 von 3' })).toBeInTheDocument()
  })
  it('Calendar follows `month` and localizes its buttons', async () => {
    const onMonthChange = vi.fn()
    render(<Calendar month={new Date(2026, 0, 1)} onMonthChange={onMonthChange} locale="en" previousMonthLabel="Vorheriger Monat" nextMonthLabel="Nächster Monat" />)
    expect(screen.getByText('January 2026')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Nächster Monat' }))
    expect(onMonthChange).toHaveBeenCalled()
    expect(screen.getByText('January 2026')).toBeInTheDocument() // still January: controlled
  })
})

describe('DatePicker and FileInput in forms', () => {
  it('DatePicker submits its date under `name`', () => {
    const { container } = render(<form><DatePicker name="due" defaultValue={new Date(2026, 10, 5)} aria-label="Due date" locale="en" /></form>)
    expect((container.querySelector('input[name="due"]') as HTMLInputElement).value).toBe('2026-11-05')
    expect(screen.getByRole('button', { name: 'Due date' })).toBeInTheDocument()
  })
  it('DatePicker opens under parent control', async () => {
    const onOpenChange = vi.fn()
    render(<DatePicker open aria-label="Due" onOpenChange={onOpenChange} locale="en" />)
    expect(await screen.findByRole('grid')).toBeInTheDocument()
  })
  it('FileInput is controlled, named and localizable', async () => {
    const file = new File(['x'], 'plan.pdf', { type: 'application/pdf' })
    const onFilesChange = vi.fn()
    const { container } = render(<FileInput name="attachment" aria-label="Attachment" value={[file]} onFilesChange={onFilesChange} removeLabel={(n) => `Entfernen ${n}`} />)
    expect(container.querySelector('input[type="file"]')).toHaveAttribute('name', 'attachment')
    await userEvent.click(screen.getByRole('button', { name: 'Entfernen plan.pdf' }))
    expect(onFilesChange).toHaveBeenCalledWith([])
    expect(screen.getByText('plan.pdf')).toBeInTheDocument() // controlled: still listed
  })
})

describe('menus and palettes', () => {
  it('CommandPalette uses a custom filter and label', async () => {
    const onSelect = vi.fn()
    render(<CommandPalette open hotkey={false} label="Befehle" closeHint="Esc" filter={(c, q) => c.id.startsWith(q)} commands={[{ id: 'new', label: 'Create', onSelect }, { id: 'open', label: 'Open', onSelect }]} />)
    const box = await screen.findByRole('combobox', { name: 'Befehle' })
    await userEvent.type(box, 'ne')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option', { name: 'Create' })).toBeInTheDocument()
  })
  it('ContextMenu opens under parent control', async () => {
    render(<ContextMenu open entries={[{ label: 'Copy' }]}><div>Area</div></ContextMenu>)
    expect(await screen.findByRole('menuitem', { name: 'Copy' })).toBeInTheDocument()
  })
  it('Menubar takes aria-label and className', () => {
    render(<Menubar aria-label="App" className="bar" menus={[{ label: 'File', entries: [{ label: 'New' }] }]} />)
    expect(screen.getByRole('menubar', { name: 'App' })).toHaveClass('bar')
  })
  it('Lightbox labels are localizable', () => {
    render(<Lightbox open index={0} onOpenChange={() => {}} onIndexChange={() => {}} label="Bildbetrachter" closeLabel="Schließen" images={[{ src: '/a.png', alt: 'A' }, { src: '/b.png', alt: 'B' }]} />)
    expect(screen.getByRole('dialog', { name: 'A' })).toHaveAttribute('aria-roledescription', 'Bildbetrachter')
    expect(screen.getByRole('button', { name: 'Schließen' })).toBeInTheDocument()
  })
})

describe('Empty', () => {
  it('can render its title as a heading', () => {
    render(<Empty title="No results" titleAs="h2" />)
    expect(screen.getByRole('heading', { level: 2, name: 'No results' })).toBeInTheDocument()
  })
})

describe('size naming', () => {
  it('Button accepts md as an alias of default', () => {
    render(<Button size="md">Go</Button>)
    expect(screen.getByRole('button', { name: 'Go' })).toHaveAttribute('data-size', 'default')
  })
})

describe('Drawer', () => {
  it('opens from the trigger, names itself by title and closes with DrawerClose', async () => {
    render(
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent title="Add to cart" description="Swipe down.">
          <DrawerClose>Done</DrawerClose>
        </DrawerContent>
      </Drawer>,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    const dialog = await screen.findByRole('dialog', { name: 'Add to cart' })
    expect(dialog).toHaveAttribute('data-side', 'bottom')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Done' }))
    await vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  })
  it('is controlled by `open`, takes a side and closes on Escape', async () => {
    const onOpenChange = vi.fn()
    render(
      <Drawer open side="right" onOpenChange={onOpenChange}>
        <DrawerContent title="Filters">x</DrawerContent>
      </Drawer>,
    )
    expect(await screen.findByRole('dialog', { name: 'Filters' })).toHaveAttribute('data-side', 'right')
    await userEvent.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything())
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument() // controlled: the parent decides
  })
  it('shows a named close button on request', async () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent title="T" showCloseButton closeLabel="关闭">x</DrawerContent>
      </Drawer>,
    )
    expect(await screen.findByRole('button', { name: '关闭' })).toBeInTheDocument()
  })
})

describe('OtpField', () => {
  it('fills boxes while typing and reports the complete code once', async () => {
    const onComplete = vi.fn()
    render(<OtpField aria-label="Code" length={4} onValueComplete={onComplete} />)
    const boxes = screen.getAllByRole('textbox')
    expect(boxes).toHaveLength(4)
    await userEvent.click(boxes[0])
    await userEvent.keyboard('1234')
    expect(boxes.map((b) => (b as HTMLInputElement).value).join('')).toBe('1234')
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete.mock.calls[0][0]).toBe('1234')
  })
  it('is controlled by `value` and ignores letters in numeric mode', async () => {
    const onChange = vi.fn()
    render(<OtpField aria-label="Code" length={4} value="12" onValueChange={onChange} />)
    const boxes = screen.getAllByRole('textbox') as HTMLInputElement[]
    expect(boxes.map((b) => b.value).join('')).toBe('12')
    await userEvent.click(boxes[2])
    await userEvent.keyboard('a')
    expect(onChange).not.toHaveBeenCalled()
  })
  it('names the first box from aria-label even though Base UI ignores it there', () => {
    render(<OtpField aria-label="Verification code" length={4} />)
    expect(screen.getByRole('textbox', { name: 'Verification code' })).toBeInTheDocument()
  })
  it('draws a separator between groups and names every box after the first', () => {
    const { container } = render(<OtpField aria-label="Code" length={6} groupSize={3} />)
    expect(container.querySelectorAll('[data-slot="otp-separator"]')).toHaveLength(1)
    expect(screen.getByRole('textbox', { name: 'Character 4 of 6' })).toBeInTheDocument()
  })
})

describe('Meter', () => {
  it('is a meter with a name, value and range', () => {
    render(<Meter label="Storage" value={68} showValue />)
    const m = screen.getByRole('meter', { name: 'Storage' })
    expect(m).toHaveAttribute('aria-valuenow', '68')
    expect(m).toHaveAttribute('aria-valuemin', '0')
    expect(m).toHaveAttribute('aria-valuemax', '100')
  })
  it('sizes the bar by the position inside min and max', () => {
    const { container } = render(<Meter aria-label="Score" value={0.25} min={0} max={1} />)
    expect((container.querySelector('[data-slot="meter-bar"]') as HTMLElement).style.width).toBe('25%')
  })
})

describe('Form', () => {
  it('blocks submit while a required field is empty, then passes values keyed by name', async () => {
    const onSubmit = vi.fn()
    render(
      <Form onFormSubmit={onSubmit}>
        <Field label="Email" name="email" required><FieldControl render={<Input required />} /></Field>
        <button type="submit">Go</button>
      </Form>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onSubmit).not.toHaveBeenCalled()
    await userEvent.type(screen.getByRole('textbox'), 'a@b.co')
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0]).toEqual({ email: 'a@b.co' })
  })
  it('shows a custom `validate` message and an external `errors` message', async () => {
    const { rerender } = render(
      <Form onFormSubmit={() => {}}>
        <Field label="Pw" name="pw" validate={(v) => (String(v).length < 3 ? 'Too short' : null)}><FieldControl render={<Input />} /></Field>
        <button type="submit">Go</button>
      </Form>,
    )
    await userEvent.type(screen.getByRole('textbox'), 'a')
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(await screen.findByText('Too short')).toBeInTheDocument()
    rerender(
      <Form errors={{ pw: 'Already used' }} onFormSubmit={() => {}}>
        <Field label="Pw" name="pw"><FieldControl render={<Input />} /></Field>
      </Form>,
    )
    expect(await screen.findByText('Already used')).toBeInTheDocument()
  })
  it('keeps the Field `error` prop working outside a Form', () => {
    render(<Field label="Name" error="Required"><FieldControl render={<Input />} /></Field>)
    expect(screen.getByText('Required')).toBeInTheDocument()
  })
})

describe('InputGroup', () => {
  it('frames the input with addons and a button, and the input keeps its name and value', async () => {
    const onClick = vi.fn()
    const { container } = render(
      <InputGroup>
        <InputGroupAddon>https://</InputGroupAddon>
        <InputGroupInput aria-label="Site" name="site" defaultValue="a.dev" />
        <InputGroupButton onClick={onClick}>Copy</InputGroupButton>
      </InputGroup>,
    )
    expect(container.querySelector('[data-slot="input-group"]')).toBeTruthy()
    expect(screen.getByRole('textbox', { name: 'Site' })).toHaveValue('a.dev')
    await userEvent.click(screen.getByRole('button', { name: 'Copy' }))
    expect(onClick).toHaveBeenCalled()
  })
  it('joins a Field label', () => {
    render(<Field label="Site"><InputGroup><InputGroupInput /></InputGroup></Field>)
    expect(screen.getByRole('textbox', { name: 'Site' })).toBeInTheDocument()
  })
})

describe('Composer', () => {
  it('sends trimmed text on Enter and clears, but Shift+Enter only adds a line', async () => {
    const onSubmit = vi.fn()
    render(<Composer onSubmit={onSubmit} />)
    const box = screen.getByRole('textbox', { name: 'Message' })
    await userEvent.type(box, '  hello{Shift>}{Enter}{/Shift}world  ')
    expect(onSubmit).not.toHaveBeenCalled()
    expect(box).toHaveValue('  hello\nworld  ')
    await userEvent.keyboard('{Enter}')
    expect(onSubmit).toHaveBeenCalledWith('hello\nworld')
    expect(box).toHaveValue('')
  })
  it('does not send empty text and disables the send button until there is some', async () => {
    const onSubmit = vi.fn()
    render(<Composer onSubmit={onSubmit} />)
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
    await userEvent.type(screen.getByRole('textbox'), '   {Enter}')
    expect(onSubmit).not.toHaveBeenCalled()
  })
  it('does not send while an IME composition is confirming', () => {
    const onSubmit = vi.fn()
    render(<Composer onSubmit={onSubmit} defaultValue="nihao" />)
    const box = screen.getByRole('textbox')
    fireEvent.keyDown(box, { key: 'Enter', isComposing: true })
    fireEvent.keyDown(box, { key: 'Enter', keyCode: 229 })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.keyDown(box, { key: 'Enter' })
    expect(onSubmit).toHaveBeenCalledWith('nihao')
  })
  it('is controlled, keeps the text when clearOnSubmit is off, and swaps send for stop while loading', async () => {
    const onChange = vi.fn()
    const onStop = vi.fn()
    const { rerender } = render(<Composer value="hi" onValueChange={onChange} clearOnSubmit={false} onSubmit={() => {}} />)
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('textbox')).toHaveValue('hi')
    await userEvent.type(screen.getByRole('textbox'), '!')
    expect(onChange).toHaveBeenCalledWith('hi!')
    expect(screen.getByRole('textbox')).toHaveValue('hi') // controlled: the parent decides
    rerender(<Composer value="hi" loading onStop={onStop} />)
    expect(screen.queryByRole('button', { name: 'Send' })).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Stop' }))
    expect(onStop).toHaveBeenCalled()
  })
})
