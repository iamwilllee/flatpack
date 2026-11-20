import * as React from 'react'
import { Dialog as BaseDialog } from '@base-ui-components/react/dialog'
import { Search } from 'lucide-react'
import { Kbd } from '@/components/ui/kbd'

export type Command = {
  id: string
  label: string
  group?: string
  icon?: React.ReactNode
  shortcut?: string
  keywords?: string[]
  onSelect: () => void
}

export type CommandPaletteProps = {
  commands: Command[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Bind ⌘K / Ctrl+K to open. On by default. */
  hotkey?: boolean
  placeholder?: string
  emptyText?: string
}

/** ⌘K search over a list of commands. Arrow keys move, Enter runs, Esc closes. */
export function CommandPalette({ commands, open: openProp, onOpenChange, hotkey = true, placeholder = 'Type a command or search…', emptyText = 'No results' }: CommandPaletteProps) {
  const [openState, setOpenState] = React.useState(false)
  const open = openProp ?? openState
  const setOpen = React.useCallback((o: boolean) => { setOpenState(o); onOpenChange?.(o) }, [onOpenChange])
  const [query, setQuery] = React.useState('')
  const [active, setActive] = React.useState(0)
  const listId = React.useId()

  React.useEffect(() => {
    if (!hotkey) return
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(!open) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hotkey, open, setOpen])

  React.useEffect(() => { if (!open) { setQuery(''); setActive(0) } }, [open])

  const q = query.trim().toLowerCase()
  const results = q
    ? commands.filter((c) => [c.label, c.group ?? '', ...(c.keywords ?? [])].some((s) => s.toLowerCase().includes(q)))
    : commands
  const run = (c?: Command) => { if (!c) return; setOpen(false); c.onSelect() }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); run(results[active]) }
  }

  let lastGroup: string | undefined
  return (
    <BaseDialog.Root open={open} onOpenChange={(o) => setOpen(o)}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop data-slot="dialog-overlay" />
        <BaseDialog.Popup data-slot="command-content" aria-label="Command palette">
          <div data-slot="command-input-row">
            <Search size={16} />
            <input
              data-slot="command-input"
              autoFocus
              value={query}
              placeholder={placeholder}
              onChange={(e) => { setQuery(e.target.value); setActive(0) }}
              onKeyDown={onKeyDown}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
            />
            <Kbd>Esc</Kbd>
          </div>
          <div data-slot="command-list" id={listId} role="listbox">
            {results.length === 0 && <div data-slot="command-empty">{emptyText}</div>}
            {results.map((c, i) => {
              const header = c.group && c.group !== lastGroup ? c.group : null
              lastGroup = c.group
              return (
                <React.Fragment key={c.id}>
                  {header && <div data-slot="command-group">{header}</div>}
                  <button
                    type="button"
                    id={`${listId}-${c.id}`}
                    data-slot="command-item"
                    data-active={i === active}
                    role="option"
                    aria-selected={i === active}
                    tabIndex={-1}
                    onMouseMove={() => setActive(i)}
                    onClick={() => run(c)}
                  >
                    {c.icon}
                    <span>{c.label}</span>
                    {c.shortcut && <Kbd>{c.shortcut}</Kbd>}
                  </button>
                </React.Fragment>
              )
            })}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
