import * as React from 'react'
import { Plus, LayoutDashboard, FolderKanban, Users, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Segmented } from '@/components/ui/segmented'
import { Select } from '@/components/ui/select'
import { Statistic } from '@/components/ui/statistic'
import { StatusDot } from '@/components/ui/status-dot'
import { Field, FieldControl } from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Sidebar, SidebarSection, SidebarItem } from '@/components/ui/sidebar'
import { Toaster, toast } from '@/components/ui/toast'
import { Kicker } from '@/components/ui/primitives'

type Status = 'Active' | 'Paused' | 'Archived'
type Project = { id: string; name: string; owner: string; status: Status; tasks: number; updated: string }

const INITIAL: Project[] = [
  { id: 'P-104', name: 'Website redesign', owner: 'Lena Fischer', status: 'Active', tasks: 42, updated: '2025-05-02' },
  { id: 'P-103', name: 'Mobile checkout', owner: 'Tomás Ruiz', status: 'Active', tasks: 28, updated: '2025-05-01' },
  { id: 'P-102', name: 'Billing migration', owner: 'Mei Chen', status: 'Paused', tasks: 17, updated: '2025-04-28' },
  { id: 'P-101', name: 'Help center', owner: 'Noah Smith', status: 'Archived', tasks: 9, updated: '2025-04-12' },
  { id: 'P-100', name: 'Analytics export', owner: 'Aiko Tanaka', status: 'Active', tasks: 31, updated: '2025-04-30' },
  { id: 'P-099', name: 'Partner portal', owner: 'Omar Haddad', status: 'Paused', tasks: 14, updated: '2025-04-22' },
]

// The sign of trend.value sets the arrow; direction only sets the color (up = green, down = red).
// Fewer open tasks is good news, so a negative value is painted green.
const STATS = {
  week: [
    { label: 'Active projects', value: '12', trend: { value: 8.3 } },
    { label: 'Open tasks', value: '186', trend: { value: -4.1, direction: 'up' as const } },
    { label: 'Shipped', value: '23', trend: { value: 12.5 } },
  ],
  month: [
    { label: 'Active projects', value: '15', trend: { value: 2.0 } },
    { label: 'Open tasks', value: '241', trend: { value: -9.6, direction: 'up' as const } },
    { label: 'Shipped', value: '88', trend: { value: 21.4 } },
  ],
}

const OWNERS = ['Lena Fischer', 'Tomás Ruiz', 'Mei Chen', 'Noah Smith', 'Aiko Tanaka', 'Omar Haddad']
const STATUS_DOT: Record<Status, 'success' | 'idle' | 'default'> = { Active: 'success', Paused: 'idle', Archived: 'default' }

const columns: DataTableColumn<Project>[] = [
  { key: 'id', header: 'ID', sortable: true, cell: (p) => <span className="fp-num">{p.id}</span> },
  { key: 'name', header: 'Project', sortable: true },
  {
    key: 'owner',
    header: 'Owner',
    sortable: true,
    cell: (p) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--fp-space-2)' }}>
        <Avatar size="sm" name={p.owner} />
        {p.owner}
      </span>
    ),
  },
  { key: 'status', header: 'Status', cell: (p) => <StatusDot status={STATUS_DOT[p.status]}>{p.status}</StatusDot> },
  { key: 'tasks', header: 'Tasks', sortable: true, align: 'end', cell: (p) => <span className="fp-num">{p.tasks}</span> },
]

export default function App() {
  const [range, setRange] = React.useState<'week' | 'month'>('week')
  const [projects, setProjects] = React.useState(INITIAL)
  const [open, setOpen] = React.useState(false)

  function create(values: Record<string, unknown>) {
    const name = String(values.name ?? '').trim()
    const owner = String(values.owner ?? OWNERS[0])
    const next: Project = { id: `P-${105 + projects.length - INITIAL.length}`, name, owner, status: 'Active', tasks: 0, updated: '2025-05-03' }
    setProjects([next, ...projects])
    setOpen(false)
    toast({ title: 'Project created', description: `${name} is now active.`, type: 'success' })
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <Sidebar aria-label="Main">
        <SidebarSection label="Workspace">
          <SidebarItem active icon={<LayoutDashboard size={16} />}>Overview</SidebarItem>
          <SidebarItem icon={<FolderKanban size={16} />}>Projects</SidebarItem>
          <SidebarItem icon={<Users size={16} />}>Team</SidebarItem>
          <SidebarItem icon={<Settings size={16} />}>Settings</SidebarItem>
        </SidebarSection>
      </Sidebar>

      <main style={{ padding: 'var(--fp-space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-9)' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 'var(--fp-space-5)' }}>
          <div>
            <Kicker>Workspace</Kicker>
            <h1 style={{ fontSize: 'var(--fp-text-xl)', fontWeight: 600, margin: 0 }}>Overview</h1>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger variant="default">
              <Plus size={16} /> New project
            </DialogTrigger>
            <DialogContent>
              <Form onFormSubmit={create}>
                <DialogHeader>
                  <DialogTitle>New project</DialogTitle>
                  <DialogDescription>Give it a name and pick who owns it.</DialogDescription>
                </DialogHeader>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-4)' }}>
                  <Field label="Name" name="name" required>
                    <FieldControl render={<Input placeholder="Project name" />} />
                  </Field>
                  <Field label="Owner" name="owner">
                    <Select name="owner" options={OWNERS.map((o) => ({ value: o, label: o }))} defaultValue={OWNERS[0]} />
                  </Field>
                </div>
                <DialogFooter>
                  <DialogClose>Cancel</DialogClose>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </Form>
            </DialogContent>
          </Dialog>
        </header>

        <section aria-labelledby="summary" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 id="summary" style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 600, margin: 0 }}>Summary</h2>
            <Segmented
              aria-label="Range"
              value={range}
              onValueChange={setRange}
              options={[{ value: 'week', label: 'This week' }, { value: 'month', label: 'This month' }]}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--fp-space-7)' }}>
            {STATS[range].map((s) => <Statistic key={s.label} {...s} />)}
          </div>
        </section>

        <section aria-labelledby="projects" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fp-space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-3)' }}>
            <h2 id="projects" style={{ fontSize: 'var(--fp-text-lg)', fontWeight: 600, margin: 0 }}>Projects</h2>
            <Badge variant="outline">{projects.length}</Badge>
          </div>
          <DataTable
            aria-label="Projects"
            columns={columns}
            data={projects}
            getRowId={(p) => p.id}
            defaultSort={{ key: 'id', direction: 'desc' }}
            pageSize={5}
            empty="No projects yet"
          />
        </section>
      </main>
      <Toaster />
    </div>
  )
}
