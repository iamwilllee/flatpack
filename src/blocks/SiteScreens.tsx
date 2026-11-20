import { useMemo, useState } from 'react'
import { ArrowRight, Check, FileText, Layers, ListChecks, PencilLine, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Collapse } from '@/components/ui/collapse'
import { ChipGroup } from '@/components/ui/chip-group'
import { Pagination } from '@/components/ui/pagination'
import { Select } from '@/components/ui/select'
import { Field, FieldControl } from '@/components/ui/field'
import { Progress } from '@/components/ui/progress'
import { Empty } from '@/components/ui/empty'
import { Steps } from '@/components/ui/steps'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'

const frame: React.CSSProperties = { background: 'var(--fp-bg)', color: 'var(--fp-ink)', padding: 'var(--fp-space-5)', minHeight: 420 }
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--fp-space-3)' }
const muted: React.CSSProperties = { color: 'var(--fp-muted)', fontSize: 'var(--fp-text-sm)' }
const h2: React.CSSProperties = { fontSize: 'var(--fp-text-lg)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 0 }

// ---------- Product site: one promise, one action, proof, steps, answers ----------
export function ProductSite() {
  const [name, setName] = useState('')
  const [sent, setSent] = useState<string | null>(null)
  return (
    <div style={frame}>
      <div style={{ ...row, paddingBottom: 'var(--fp-space-4)', borderBottom: '1px solid var(--fp-line)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-2)', fontWeight: 'var(--fp-weight-semibold)' }}>
          <PencilLine size={16} /> Fieldnote <Badge variant="outline">Fictional</Badge>
        </span>
        <span style={muted}>Features · How it works · FAQ</span>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 'var(--fp-space-6)', padding: 'var(--fp-space-7) 0' }}>
        <div>
          <div className="fp-label" style={{ marginBottom: 'var(--fp-space-3)' }}>NOTES FOR TEAMS</div>
          <h3 style={{ fontSize: 'var(--fp-text-2xl)', lineHeight: 'var(--fp-leading-heading)', fontWeight: 'var(--fp-weight-semibold)', letterSpacing: 'var(--fp-tracking-display)', margin: 0, maxWidth: '11em' }}>
            Write it down once. Find it every time.
          </h3>
          <p style={{ ...muted, fontSize: 'var(--fp-text-base)', margin: 'var(--fp-space-4) 0 var(--fp-space-5)', maxWidth: 420 }}>
            A quiet place for decisions, meeting notes and the reasons behind them.
          </p>
          <Button size="lg">Try the demo <ArrowRight size={16} /></Button>
          <div style={{ ...muted, fontSize: 'var(--fp-text-xs)', marginTop: 'var(--fp-space-3)' }}>No account needed. Nothing is saved.</div>
        </div>
        <Card>
          <CardHeader>
            <div style={row}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-2)', fontSize: 'var(--fp-text-sm)' }}><FileText size={16} /> Decision record</span>
              <Badge variant="secondary">Sample</Badge>
            </div>
            <CardTitle>Move the weekly review to Tuesday</CardTitle>
            <CardDescription>Agreed in the planning meeting. Revisit in six weeks.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--fp-space-3)', fontSize: 'var(--fp-text-sm)' }}>
              {['Context and options considered', 'Who decided, and when', 'What would change the decision'].map((t) => (
                <li key={t} style={{ display: 'flex', gap: 'var(--fp-space-3)' }}><Check size={16} style={{ flexShrink: 0, color: 'var(--fp-accent)' }} />{t}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section style={{ borderTop: '1px solid var(--fp-line)', padding: 'var(--fp-space-6) 0' }}>
        <h3 style={h2}>Built for the way teams remember</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 'var(--fp-space-5)', marginTop: 'var(--fp-space-5)' }}>
          {[
            { icon: <PencilLine size={16} />, title: 'Plain writing', body: 'No templates to learn. Start with a sentence.' },
            { icon: <Layers size={16} />, title: 'Linked context', body: 'Notes point to the decisions they led to.' },
            { icon: <ListChecks size={16} />, title: 'Clear follow-ups', body: 'Every action has an owner and a date.' },
          ].map((f) => (
            <div key={f.title} style={{ display: 'grid', gap: 'var(--fp-space-2)' }}>
              <span style={{ color: 'var(--fp-accent)' }}>{f.icon}</span>
              <strong style={{ fontSize: 'var(--fp-text-sm)' }}>{f.title}</strong>
              <span style={muted}>{f.body}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ borderTop: '1px solid var(--fp-line)', padding: 'var(--fp-space-6) 0' }}>
        <h3 style={{ ...h2, marginBottom: 'var(--fp-space-5)' }}>How it works</h3>
        <Steps current={1} steps={[{ title: 'Write', description: 'Capture the note.' }, { title: 'Link', description: 'Connect it to a decision.' }, { title: 'Review', description: 'Come back with context.' }]} />
      </section>

      <section style={{ borderTop: '1px solid var(--fp-line)', padding: 'var(--fp-space-6) 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--fp-space-6)' }}>
        <div>
          <h3 style={h2}>Try a brief</h3>
          <p style={{ ...muted, margin: 'var(--fp-space-2) 0 var(--fp-space-4)' }}>Describe what you want to remember. The result stays on this page.</p>
          <form
            style={{ display: 'grid', gap: 'var(--fp-space-3)' }}
            onSubmit={(e) => { e.preventDefault(); if (name.trim()) setSent(name.trim()) }}
          >
            <Field label="Title" required><FieldControl render={<Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Weekly review day" />} /></Field>
            <div><Button type="submit" disabled={!name.trim()}>Create sample note</Button></div>
          </form>
          {sent && <p role="status" style={{ marginTop: 'var(--fp-space-3)', fontSize: 'var(--fp-text-sm)' }}>“{sent}” was added to this preview only.</p>}
        </div>
        <div>
          <h3 style={{ ...h2, marginBottom: 'var(--fp-space-3)' }}>Questions</h3>
          <Collapse items={[
            { key: 'a', title: 'Is anything saved?', children: 'No. This is a static preview; every action resets on reload.' },
            { key: 'b', title: 'Can I change the look?', children: 'Yes. Switch the theme above, or tune density and fonts on the Create page.' },
          ]} />
        </div>
      </section>
    </div>
  )
}

// ---------- Directory: search, categories, results, pages ----------
const articles = [
  { title: 'Getting started with your first workspace', category: 'Guides', read: '4 min' },
  { title: 'Invite teammates and set roles', category: 'Guides', read: '3 min' },
  { title: 'What changed in this release', category: 'Announcements', read: '2 min' },
  { title: 'Fix: notifications arrive twice', category: 'Help', read: '2 min' },
  { title: 'Export your data', category: 'Help', read: '3 min' },
  { title: 'Scheduled maintenance this weekend', category: 'Announcements', read: '1 min' },
  { title: 'Keyboard shortcuts', category: 'Guides', read: '2 min' },
  { title: 'Reset a forgotten password', category: 'Help', read: '2 min' },
]
const PAGE_SIZE = 4

export function Directory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)
  const results = useMemo(
    () => articles.filter((a) => (category === 'All' || a.category === category) && a.title.toLowerCase().includes(query.trim().toLowerCase())),
    [query, category],
  )
  const shown = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  return (
    <div style={frame}>
      <div style={{ ...row, paddingBottom: 'var(--fp-space-4)', borderBottom: '1px solid var(--fp-line)' }}>
        <strong>Help centre</strong>
        <span style={muted}>Fictional example</span>
      </div>
      <h3 style={{ ...h2, margin: 'var(--fp-space-5) 0 var(--fp-space-4)' }}>How can we help?</h3>
      <Input
        leading={<Search size={16} />}
        placeholder="Search articles"
        aria-label="Search articles"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setPage(1) }}
      />
      <div style={{ margin: 'var(--fp-space-4) 0', overflowX: 'auto' }}>
        <ChipGroup
          aria-label="Category"
          value={category}
          onValueChange={(v) => { setCategory(v); setPage(1) }}
          options={['All', 'Guides', 'Help', 'Announcements'].map((c) => ({ value: c, label: c, count: c === 'All' ? articles.length : articles.filter((a) => a.category === c).length }))}
        />
      </div>
      {shown.length === 0 ? (
        <Empty
          title="No matching articles"
          description="Try another word or category."
          action={<Button size="sm" variant="outline" onClick={() => { setQuery(''); setCategory('All') }}>Clear filters</Button>}
        />
      ) : (
        <div style={{ display: 'grid', gap: 'var(--fp-space-3)' }}>
          {shown.map((a) => (
            <Card key={a.title}>
              <CardContent style={{ ...row, padding: 'var(--fp-space-4)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 'var(--fp-weight-medium)' }}>{a.title}</div>
                  <div style={{ ...muted, fontSize: 'var(--fp-text-xs)', marginTop: 'var(--fp-space-1)' }}>{a.read} read</div>
                </div>
                <Badge variant="outline">{a.category}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {results.length > PAGE_SIZE && (
        <div style={{ marginTop: 'var(--fp-space-5)', display: 'flex', justifyContent: 'center' }}>
          <Pagination total={results.length} pageSize={PAGE_SIZE} value={page} onValueChange={setPage} />
        </div>
      )}
    </div>
  )
}

// ---------- Workbench: filter, inspect, add ----------
type Task = { id: number; name: string; status: 'Idea' | 'Building' | 'Live'; note: string }
const initialTasks: Task[] = [
  { id: 1, name: 'Review the product page copy', status: 'Building', note: 'Check the headline, the first action and the empty states.' },
  { id: 2, name: 'Plan the launch checklist', status: 'Idea', note: 'List what must be true before the first visitor arrives.' },
  { id: 3, name: 'Publish the help centre', status: 'Live', note: 'Searchable articles with categories and a clear way back.' },
]
const statusOptions = [
  { value: 'All', label: 'All statuses' },
  { value: 'Idea', label: 'Idea' },
  { value: 'Building', label: 'Building' },
  { value: 'Live', label: 'Live' },
]

export function Workbench() {
  const [tasks, setTasks] = useState(initialTasks)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [selected, setSelected] = useState<number | null>(1)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ name: '', note: '' })
  const shown = tasks.filter((t) => (status === 'All' || t.status === status) && t.name.toLowerCase().includes(query.trim().toLowerCase()))
  const current = tasks.find((t) => t.id === selected)
  const done = tasks.filter((t) => t.status === 'Live').length
  const add = () => {
    if (!draft.name.trim()) return
    const id = Math.max(0, ...tasks.map((t) => t.id)) + 1
    setTasks([...tasks, { id, name: draft.name.trim(), status: 'Idea', note: draft.note.trim() || 'No notes yet.' }])
    setSelected(id)
    setDraft({ name: '', note: '' })
    setOpen(false)
  }
  return (
    <div style={frame}>
      <div style={{ ...row, paddingBottom: 'var(--fp-space-4)', borderBottom: '1px solid var(--fp-line)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--fp-space-2)' }}><strong>Launchpad</strong><Badge variant="outline">Fictional example</Badge></span>
        <Button size="sm" onClick={() => setOpen(true)}><Plus size={16} /> New task</Button>
      </div>

      <div style={{ margin: 'var(--fp-space-4) 0' }}>
        <Progress value={done} max={tasks.length} label="Completed" showValue />
      </div>

      <div style={{ display: 'flex', gap: 'var(--fp-space-3)', flexWrap: 'wrap', marginBottom: 'var(--fp-space-4)' }}>
        <div style={{ flex: '1 1 200px' }}>
          <Input leading={<Search size={16} />} placeholder="Search tasks" aria-label="Search tasks" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div style={{ width: 180 }}><Select aria-label="Status" value={status} onValueChange={setStatus} options={statusOptions} /></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 'var(--fp-space-4)', alignItems: 'start' }}>
        <Card>
          {shown.length === 0 ? (
            <Empty title="No tasks match" description="Clear a filter to see them again." />
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Task</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {shown.map((t) => (
                  <TableRow key={t.id} data-selected={t.id === selected ? 'true' : undefined}>
                    <TableCell>
                      <Button variant="link" size="sm" aria-pressed={t.id === selected} onClick={() => setSelected(t.id)}>{t.name}</Button>
                    </TableCell>
                    <TableCell><Badge variant={t.status === 'Live' ? 'default' : 'outline'}>{t.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
        <Card>
          <CardHeader>
            <div className="fp-label">TASK DETAILS</div>
            <CardTitle>{current ? current.name : 'Nothing selected'}</CardTitle>
            <CardDescription>{current ? current.note : 'Pick a task to read its notes.'}</CardDescription>
          </CardHeader>
          {current && (
            <CardContent>
              <div style={{ display: 'grid', gap: 'var(--fp-space-2)', maxWidth: 220 }}>
                <Select
                  aria-label="Change status"
                  value={current.status}
                  onValueChange={(v) => setTasks(tasks.map((t) => (t.id === current.id ? { ...t, status: v as Task['status'] } : t)))}
                  options={statusOptions.slice(1)}
                />
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New task</DialogTitle>
            <DialogDescription>Added to this preview only. It resets on reload.</DialogDescription>
          </DialogHeader>
          <div style={{ display: 'grid', gap: 'var(--fp-space-3)' }}>
            <Field label="Name" required><FieldControl render={<Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />} /></Field>
            <Field label="Notes"><FieldControl render={<Textarea value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} rows={3} />} /></Field>
          </div>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button onClick={add} disabled={!draft.name.trim()}>Add task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
