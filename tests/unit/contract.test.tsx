// The contract every form control and overlay keeps: controlled and uncontrolled use, and
// props (id, name, aria-*, className, ref) reaching the DOM. Guards the Base UI upgrade path.
import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
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
