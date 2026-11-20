import * as React from 'react'
import { ChevronRight, ChevronDown, Folder, FolderOpen, File as FileIcon } from 'lucide-react'

export type TreeNode = { id: string; label: React.ReactNode; children?: TreeNode[]; icon?: React.ReactNode }

export type TreeProps = {
  nodes: TreeNode[]
  defaultExpanded?: string[]
  selected?: string | null
  defaultSelected?: string | null
  onSelect?: (id: string) => void
  /** Controlled: ids of the open folders. Pair with onExpandedChange. */
  expanded?: string[]
  onExpandedChange?: (ids: string[]) => void
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

/** A file tree. Click a folder to open it; the selected row is an ink block. Arrow keys work like a file manager. */
export function Tree({ nodes, defaultExpanded = [], expanded: expandedProp, onExpandedChange, selected, defaultSelected = null, onSelect, className, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy }: TreeProps) {
  const [openState, setOpenState] = React.useState<Set<string>>(() => new Set(defaultExpanded))
  const open = React.useMemo(() => (expandedProp ? new Set(expandedProp) : openState), [expandedProp, openState])
  const [inner, setInner] = React.useState<string | null>(defaultSelected)
  const current = selected !== undefined ? selected : inner
  const root = React.useRef<HTMLUListElement>(null)

  const toggle = (id: string, to?: boolean) => {
    const n = new Set(open)
    if (to ?? !n.has(id)) n.add(id); else n.delete(id)
    if (!expandedProp) setOpenState(n)
    onExpandedChange?.([...n])
  }
  const pick = (id: string) => { setInner(id); onSelect?.(id) }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const items = Array.from(root.current?.querySelectorAll<HTMLButtonElement>('[data-slot="tree-item"]') ?? [])
    const i = items.indexOf(document.activeElement as HTMLButtonElement)
    if (i < 0) return
    const el = items[i]
    const id = el.dataset.id!
    const hasKids = el.dataset.branch === 'true'
    if (e.key === 'ArrowDown') { e.preventDefault(); items[i + 1]?.focus() }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[i - 1]?.focus() }
    else if (e.key === 'ArrowRight' && hasKids) { e.preventDefault(); toggle(id, true) }
    else if (e.key === 'ArrowLeft' && hasKids) { e.preventDefault(); toggle(id, false) }
  }

  const render = (list: TreeNode[], depth: number): React.ReactNode => (
    <ul data-slot="tree" role={depth === 0 ? 'tree' : 'group'} className={depth === 0 ? className : undefined} aria-label={depth === 0 ? ariaLabel : undefined} aria-labelledby={depth === 0 ? labelledBy : undefined} ref={depth === 0 ? root : undefined} onKeyDown={depth === 0 ? onKeyDown : undefined}>
      {list.map((n) => {
        const branch = !!n.children?.length
        const expanded = open.has(n.id)
        return (
          <li key={n.id} role="none">
            <button
              type="button"
              role="treeitem"
              data-slot="tree-item"
              data-id={n.id}
              data-branch={branch}
              data-selected={current === n.id}
              aria-expanded={branch ? expanded : undefined}
              aria-selected={current === n.id}
              onClick={() => { if (branch) toggle(n.id); pick(n.id) }}
            >
              <span data-slot="tree-chevron">{branch ? (expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : null}</span>
              {n.icon ?? (branch ? (expanded ? <FolderOpen size={16} /> : <Folder size={16} />) : <FileIcon size={16} />)}
              <span>{n.label}</span>
            </button>
            {branch && expanded && render(n.children!, depth + 1)}
          </li>
        )
      })}
    </ul>
  )
  return <>{render(nodes, 0)}</>
}
