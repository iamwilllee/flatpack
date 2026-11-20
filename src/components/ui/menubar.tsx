import { Menubar as BaseMenubar } from '@base-ui/react/menubar'
import { Menu as BaseMenu } from '@base-ui/react/menu'
import { MenuEntries, type MenuEntry } from '@/components/ui/context-menu'

export type MenubarMenu = { label: string; entries: MenuEntry[] }

/** A desktop-style menu bar: File, Edit, View … Hovering moves between open menus. */
export type MenubarProps = Omit<BaseMenubar.Props, 'className' | 'children'> & {
  menus: MenubarMenu[]
  className?: string
}

export function Menubar({ menus, className, ...props }: MenubarProps) {
  return (
    <BaseMenubar data-slot="menubar" className={className} {...props}>
      {menus.map((m) => (
        <BaseMenu.Root key={m.label}>
          <BaseMenu.Trigger data-slot="menubar-trigger">{m.label}</BaseMenu.Trigger>
          <BaseMenu.Portal>
            <BaseMenu.Positioner data-slot="menubar-positioner" sideOffset={4} align="start">
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
