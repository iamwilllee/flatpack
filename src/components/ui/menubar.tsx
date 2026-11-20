import { Menubar as BaseMenubar } from '@base-ui/react/menubar'
import { Menu as BaseMenu } from '@base-ui/react/menu'
import { MenuEntries, type MenuEntry } from '@/components/ui/context-menu'

export type MenubarMenu = { label: string; entries: MenuEntry[] }

/** A desktop-style menu bar: File, Edit, View … Hovering moves between open menus. */
export function Menubar({ menus }: { menus: MenubarMenu[] }) {
  return (
    <BaseMenubar data-slot="menubar">
      {menus.map((m) => (
        <BaseMenu.Root key={m.label}>
          <BaseMenu.Trigger data-slot="menubar-trigger">{m.label}</BaseMenu.Trigger>
          <BaseMenu.Portal>
            <BaseMenu.Positioner sideOffset={4} align="start" style={{ zIndex: 50 }}>
              <BaseMenu.Popup data-slot="menu-content">
                <MenuEntries entries={m.entries} Item={BaseMenu.Item} Separator={BaseMenu.Separator} />
              </BaseMenu.Popup>
            </BaseMenu.Positioner>
          </BaseMenu.Portal>
        </BaseMenu.Root>
      ))}
    </BaseMenubar>
  )
}
