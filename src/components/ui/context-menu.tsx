import * as React from 'react'
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu'
import { Kbd } from '@/components/ui/kbd'

export type MenuEntry =
  | { type?: 'item'; label: React.ReactNode; shortcut?: string; icon?: React.ReactNode; danger?: boolean; disabled?: boolean; onSelect?: () => void }
  | { type: 'separator' }

/** Shared item list for ContextMenu and Menubar. */
export function MenuEntries({ entries, Item, Separator }: {
  entries: MenuEntry[]
  Item: React.ElementType
  Separator: React.ElementType
}) {
  return entries.map((e, i) =>
    e.type === 'separator'
      ? <Separator key={i} data-slot="menu-separator" />
      : (
        <Item key={i} data-slot="menu-item" data-variant={e.danger ? 'danger' : undefined} disabled={e.disabled} onClick={e.onSelect}>
          {e.icon}
          <span>{e.label}</span>
          {e.shortcut && <Kbd>{e.shortcut}</Kbd>}
        </Item>
      ),
  )
}

/** Right-click (or long-press) menu over an area. */
export type ContextMenuProps = Omit<BaseContextMenu.Root.Props, 'children'> & {
  children: React.ReactNode
  entries: MenuEntry[]
  /** Class of the area that opens the menu. */
  className?: string
}

/** Controlled (`open` + `onOpenChange`) or uncontrolled. Base UI root props pass through. */
export function ContextMenu({ children, entries, className, ...props }: ContextMenuProps) {
  return (
    <BaseContextMenu.Root {...props}>
      <BaseContextMenu.Trigger data-slot="context-menu-trigger" className={className}>{children}</BaseContextMenu.Trigger>
      <BaseContextMenu.Portal>
        <BaseContextMenu.Positioner data-slot="context-menu-positioner">
          <BaseContextMenu.Popup data-slot="menu-content">
            <MenuEntries entries={entries} Item={BaseContextMenu.Item} Separator={BaseContextMenu.Separator} />
          </BaseContextMenu.Popup>
        </BaseContextMenu.Positioner>
      </BaseContextMenu.Portal>
    </BaseContextMenu.Root>
  )
}
